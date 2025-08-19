import type { SchemaField, DMMFModel, DMMFField, DMMF } from '@prismate/core';

// Schema builder interface
export interface ISchemaBuilder<TDMMF> {
  readonly schemas: Record<string, Record<string, SchemaField>>;
  readonly modelCount: number;
  readonly fieldCount: number;
  
  buildSchemas(dmmf: TDMMF): Record<string, Record<string, SchemaField>>;
  buildModelSchema(model: DMMFModel): Record<string, SchemaField>;
  createSchemaField(field: DMMFField): SchemaField;
  validateSchema(schema: Record<string, Record<string, SchemaField>>): boolean;
}

// Schema parsing options
export interface SchemaParseOptions {
  readonly includeRelations?: boolean;
  readonly includeDefaults?: boolean;
  readonly includeMetadata?: boolean;
  readonly strictMode?: boolean;
  readonly validateTypes?: boolean;
}

// Schema validation result
export interface SchemaValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly modelCount: number;
  readonly fieldCount: number;
}

// Schema metadata
export interface SchemaMetadata {
  readonly version: string;
  readonly generatedAt: Date;
  readonly source: string;
  readonly checksum: string;
  readonly modelCount: number;
  readonly fieldCount: number;
}

// Schema transformation options
export interface SchemaTransformOptions {
  readonly fieldNameTransform?: (name: string) => string;
  readonly typeTransform?: (type: string) => string;
  readonly filterModels?: (model: DMMFModel) => boolean;
  readonly filterFields?: (field: DMMFField) => boolean;
}

// Schema export format
export type SchemaExportFormat = 'json' | 'typescript' | 'graphql' | 'prisma';

// Schema export options
export interface SchemaExportOptions {
  readonly format: SchemaExportFormat;
  readonly includeMetadata?: boolean;
  readonly prettyPrint?: boolean;
  readonly includeComments?: boolean;
}