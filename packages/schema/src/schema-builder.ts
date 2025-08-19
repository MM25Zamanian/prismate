import { camelCase } from 'change-case';
import type { 
  ISchemaBuilder, 
  SchemaParseOptions, 
  SchemaValidationResult,
  SchemaMetadata,
  SchemaTransformOptions,
  SchemaExportOptions
} from './types';
import { DEFAULT_SCHEMA_OPTIONS, DEFAULT_SCHEMA_METADATA } from './constants';
import {
  validateDMMFModel,
  validateDMMFField,
  checkDuplicateModels,
  checkDuplicateFields,
  createSchemaChecksum,
  normalizeModelName,
  normalizeFieldName
} from './utils';
import type { SchemaField, DMMFModel, DMMFField, DMMF } from '@prismate/core';

/**
 * SchemaBuilder provides comprehensive schema parsing and building functionality
 * for Prisma DMMF data with validation, transformation, and export capabilities.
 */
export class SchemaBuilder<TDMMF = DMMF> implements ISchemaBuilder<TDMMF> {
  private _schemas: Record<string, Record<string, SchemaField>> = {};
  private _options: SchemaParseOptions;
  private _metadata: SchemaMetadata;

  constructor(options: Partial<SchemaParseOptions> = {}) {
    this._options = { ...DEFAULT_SCHEMA_OPTIONS, ...options };
    this._metadata = this.createMetadata();
  }

  /**
   * Gets the current schemas
   */
  get schemas(): Record<string, Record<string, SchemaField>> {
    return Object.freeze({ ...this._schemas });
  }

  /**
   * Gets the number of models
   */
  get modelCount(): number {
    return Object.keys(this._schemas).length;
  }

  /**
   * Gets the total number of fields across all models
   */
  get fieldCount(): number {
    let count = 0;
    for (const modelSchema of Object.values(this._schemas)) {
      count += Object.keys(modelSchema).length;
    }
    return count;
  }

  /**
   * Gets the current options
   */
  get options(): Readonly<SchemaParseOptions> {
    return Object.freeze({ ...this._options });
  }

  /**
   * Gets the current metadata
   */
  get metadata(): Readonly<SchemaMetadata> {
    return Object.freeze({ ...this._metadata });
  }

  /**
   * Builds schemas from DMMF data
   */
  buildSchemas(dmmf: TDMMF): Record<string, Record<string, SchemaField>> {
    if (!this.isValidDMMF(dmmf)) {
      throw new Error('Invalid DMMF data provided');
    }

    const dmmfData = dmmf as DMMF;
    if (!dmmfData.datamodel?.models) {
      throw new Error('No models found in DMMF data');
    }

    // Validate models
    const validationResult = this.validateDMMFModels(dmmfData.datamodel.models);
    if (!validationResult.isValid) {
      throw new Error(`Schema validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Build schemas
    this._schemas = {};
    for (const model of dmmfData.datamodel.models) {
      const normalizedName = normalizeModelName(model.name);
      this._schemas[normalizedName] = this.buildModelSchema(model);
    }

    // Update metadata
    this._metadata = this.createMetadata();

    return this.schemas;
  }

  /**
   * Builds schema for a single model
   */
  buildModelSchema(model: DMMFModel): Record<string, SchemaField> {
    const modelSchema: Record<string, SchemaField> = {};

    for (const field of model.fields) {
      const normalizedFieldName = normalizeFieldName(field.name);
      modelSchema[normalizedFieldName] = this.createSchemaField(field);
    }

    return Object.freeze(modelSchema);
  }

  /**
   * Creates a schema field from DMMF field data
   */
  createSchemaField(field: DMMFField): SchemaField {
    const schemaField: SchemaField = {
      name: field.name,
      type: field.type,
      kind: field.kind,
      isRequired: field.isRequired,
      isList: field.isList,
      isUnique: field.isUnique,
      isId: field.isId,
      hasDefaultValue: field.hasDefaultValue,
    };

    // Add optional fields based on options
    if (this._options.includeRelations) {
      if (field.relationName) schemaField.relationName = field.relationName;
      if (field.relationFromFields) {
        schemaField.relationFromFields = Object.freeze([...field.relationFromFields]);
      }
      if (field.relationToFields) {
        schemaField.relationToFields = Object.freeze([...field.relationToFields]);
      }
      if (field.relationOnDelete) schemaField.relationOnDelete = field.relationOnDelete;
      if (field.relationOnUpdate) schemaField.relationOnUpdate = field.relationOnUpdate;
    }

    if (this._options.includeDefaults && field.default !== undefined) {
      schemaField.default = field.default;
    }

    return Object.freeze(schemaField);
  }

  /**
   * Validates the current schema
   */
  validateSchema(schema: Record<string, Record<string, SchemaField>>): boolean {
    const validationResult = this.validateSchemaStructure(schema);
    return validationResult.isValid;
  }

  /**
   * Validates DMMF models structure
   */
  private validateDMMFModels(models: DMMFModel[]): SchemaValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for duplicates
    errors.push(...checkDuplicateModels(models));

    // Validate individual models
    for (const model of models) {
      errors.push(...validateDMMFModel(model));
      
      if (model.fields) {
        errors.push(...checkDuplicateFields(model.fields));
        
        for (const field of model.fields) {
          errors.push(...validateDMMFField(field));
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      modelCount: models.length,
      fieldCount: models.reduce((count, model) => count + (model.fields?.length || 0), 0)
    };
  }

  /**
   * Validates schema structure
   */
  private validateSchemaStructure(schema: Record<string, Record<string, SchemaField>>): SchemaValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (Object.keys(schema).length === 0) {
      errors.push('Schema is empty');
    }

    for (const [modelName, modelSchema] of Object.entries(schema)) {
      if (Object.keys(modelSchema).length === 0) {
        warnings.push(`Model ${modelName} has no fields`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      modelCount: Object.keys(schema).length,
      fieldCount: Object.values(schema).reduce((count, model) => count + Object.keys(model).length, 0)
    };
  }

  /**
   * Checks if DMMF data is valid
   */
  private isValidDMMF(dmmf: any): dmmf is DMMF {
    return (
      dmmf &&
      typeof dmmf === 'object' &&
      dmmf.datamodel &&
      Array.isArray(dmmf.datamodel.models)
    );
  }

  /**
   * Creates metadata for the schema
   */
  private createMetadata(): SchemaMetadata {
    const schemaData = JSON.stringify(this._schemas);
    
    return {
      ...DEFAULT_SCHEMA_METADATA,
      generatedAt: new Date(),
      checksum: createSchemaChecksum(schemaData),
      modelCount: this.modelCount,
      fieldCount: this.fieldCount,
    };
  }

  /**
   * Transforms the schema based on options
   */
  transformSchema(options: SchemaTransformOptions): Record<string, Record<string, SchemaField>> {
    const transformed: Record<string, Record<string, SchemaField>> = {};

    for (const [modelName, modelSchema] of Object.entries(this._schemas)) {
      // Apply model filter
      if (options.filterModels) {
        const originalModel = this.findOriginalModel(modelName);
        if (originalModel && !options.filterModels(originalModel)) {
          continue;
        }
      }

      const transformedModel: Record<string, SchemaField> = {};

      for (const [fieldName, fieldSchema] of Object.entries(modelSchema)) {
        // Apply field filter
        if (options.filterFields) {
          const originalField = this.findOriginalField(modelName, fieldName);
          if (originalField && !options.filterFields(originalField)) {
            continue;
          }
        }

        const transformedField: SchemaField = { ...fieldSchema };

        // Apply name transformation
        if (options.fieldNameTransform) {
          transformedField.name = options.fieldNameTransform(fieldSchema.name);
        }

        // Apply type transformation
        if (options.typeTransform) {
          transformedField.type = options.typeTransform(fieldSchema.type);
        }

        transformedModel[fieldName] = Object.freeze(transformedField);
      }

      transformed[modelName] = Object.freeze(transformedModel);
    }

    return Object.freeze(transformed);
  }

  /**
   * Finds the original model from DMMF data
   */
  private findOriginalModel(modelName: string): DMMFModel | null {
    // This would need access to the original DMMF data
    // For now, return null as this is a simplified implementation
    return null;
  }

  /**
   * Finds the original field from DMMF data
   */
  private findOriginalField(modelName: string, fieldName: string): DMMFField | null {
    // This would need access to the original DMMF data
    // For now, return null as this is a simplified implementation
    return null;
  }

  /**
   * Exports the schema in various formats
   */
  exportSchema(options: SchemaExportOptions): string {
    switch (options.format) {
      case 'json':
        return this.exportAsJSON(options);
      case 'typescript':
        return this.exportAsTypeScript(options);
      case 'graphql':
        return this.exportAsGraphQL(options);
      case 'prisma':
        return this.exportAsPrisma(options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Exports schema as JSON
   */
  private exportAsJSON(options: SchemaExportOptions): string {
    const data: any = { schemas: this._schemas };
    
    if (options.includeMetadata) {
      data.metadata = this._metadata;
    }

    return options.prettyPrint 
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  }

  /**
   * Exports schema as TypeScript
   */
  private exportAsTypeScript(options: SchemaExportOptions): string {
    let output = '// Generated Prismate Schema\n';
    
    if (options.includeMetadata) {
      output += `// Generated at: ${this._metadata.generatedAt.toISOString()}\n`;
      output += `// Model count: ${this._metadata.modelCount}\n`;
      output += `// Field count: ${this._metadata.fieldCount}\n`;
    }
    
    output += '\n';

    for (const [modelName, modelSchema] of Object.entries(this._schemas)) {
      output += `export interface ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} {\n`;
      
      for (const [fieldName, fieldSchema] of Object.entries(modelSchema)) {
        const type = this.mapPrismaTypeToTypeScript(fieldSchema.type);
        const optional = fieldSchema.isRequired ? '' : '?';
        const comment = options.includeComments ? ` // ${fieldSchema.kind}` : '';
        
        output += `  ${fieldName}${optional}: ${type};${comment}\n`;
      }
      
      output += '}\n\n';
    }

    return output;
  }

  /**
   * Exports schema as GraphQL
   */
  private exportAsGraphQL(options: SchemaExportOptions): string {
    let output = '# Generated Prismate Schema\n';
    
    if (options.includeMetadata) {
      output += `# Generated at: ${this._metadata.generatedAt.toISOString()}\n`;
      output += `# Model count: ${this._metadata.modelCount}\n`;
      output += `# Field count: ${this._metadata.fieldCount}\n`;
    }
    
    output += '\n';

    for (const [modelName, modelSchema] of Object.entries(this._schemas)) {
      output += `type ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} {\n`;
      
      for (const [fieldName, fieldSchema] of Object.entries(modelSchema)) {
        const type = this.mapPrismaTypeToGraphQL(fieldSchema.type);
        const comment = options.includeComments ? ` # ${fieldSchema.kind}` : '';
        
        output += `  ${fieldName}: ${type}${comment}\n`;
      }
      
      output += '}\n\n';
    }

    return output;
  }

  /**
   * Exports schema as Prisma
   */
  private exportAsPrisma(options: SchemaExportOptions): string {
    let output = '// Generated Prismate Schema\n';
    
    if (options.includeMetadata) {
      output += `// Generated at: ${this._metadata.generatedAt.toISOString()}\n`;
      output += `// Model count: ${this._metadata.modelCount}\n`;
      output += `// Field count: ${this._metadata.fieldCount}\n`;
    }
    
    output += '\n';

    for (const [modelName, modelSchema] of Object.entries(this._schemas)) {
      output += `model ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} {\n`;
      
      for (const [fieldName, fieldSchema] of Object.entries(modelSchema)) {
        const type = fieldSchema.type;
        const modifiers: string[] = [];
        
        if (fieldSchema.isId) modifiers.push('@id');
        if (fieldSchema.isUnique) modifiers.push('@unique');
        if (fieldSchema.isRequired) modifiers.push('@required');
        if (fieldSchema.isList) modifiers.push('[]');
        
        const comment = options.includeComments ? ` // ${fieldSchema.kind}` : '';
        
        output += `  ${fieldName} ${type}${modifiers.join(' ')}${comment}\n`;
      }
      
      output += '}\n\n';
    }

    return output;
  }

  /**
   * Maps Prisma types to TypeScript types
   */
  private mapPrismaTypeToTypeScript(prismaType: string): string {
    const typeMap: Record<string, string> = {
      'String': 'string',
      'Int': 'number',
      'Float': 'number',
      'Boolean': 'boolean',
      'DateTime': 'Date',
      'Json': 'any',
      'BigInt': 'bigint',
      'Decimal': 'number',
      'Bytes': 'Buffer',
    };

    return typeMap[prismaType] || 'any';
  }

  /**
   * Maps Prisma types to GraphQL types
   */
  private mapPrismaTypeToGraphQL(prismaType: string): string {
    const typeMap: Record<string, string> = {
      'String': 'String',
      'Int': 'Int',
      'Float': 'Float',
      'Boolean': 'Boolean',
      'DateTime': 'DateTime',
      'Json': 'JSON',
      'BigInt': 'BigInt',
      'Decimal': 'Decimal',
      'Bytes': 'Bytes',
    };

    return typeMap[prismaType] || 'String';
  }
}