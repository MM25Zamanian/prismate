import { z } from 'zod';
import type { 
  ISchemaValidator, 
  ValidationRule, 
  ValidationResult, 
  ValidationContext,
  ValidationOptions,
  SchemaField 
} from './types';
import { DEFAULT_VALIDATION_OPTIONS } from './constants';
import {
  createValidationResult,
  createValidationError,
  createValidationWarning,
  mergeValidationResults,
  validateRequired,
  validateFieldType,
  createZodSchemaFromField
} from './utils';
import { VALIDATION_ERROR_CODES, VALIDATION_WARNING_CODES } from './constants';

/**
 * SchemaValidator provides comprehensive validation functionality using Zod schemas
 * and custom validation rules for Prisma models.
 */
export class SchemaValidator<T = any> implements ISchemaValidator<T> {
  private _schema: z.ZodType<T>;
  private _rules: ValidationRule[] = [];
  private _options: ValidationOptions;
  private _fieldValidators: Map<string, ValidationRule[]> = new Map();

  constructor(
    schema: z.ZodType<T>,
    options: Partial<ValidationOptions> = {}
  ) {
    this._schema = schema;
    this._options = { ...DEFAULT_VALIDATION_OPTIONS, ...options };
  }

  /**
   * Gets the Zod schema
   */
  get schema(): z.ZodType<T> {
    return this._schema;
  }

  /**
   * Gets the validation rules
   */
  get rules(): ValidationRule[] {
    return [...this._rules];
  }

  /**
   * Gets the validation options
   */
  get options(): Readonly<ValidationOptions> {
    return Object.freeze({ ...this._options });
  }

  /**
   * Validates data against the schema and rules
   */
  validate(data: unknown): ValidationResult {
    const startTime = Date.now();
    
    try {
      // First, validate with Zod schema
      const zodResult = this._schema.safeParse(data);
      
      if (!zodResult.success) {
        const errors = zodResult.error.errors.map(error => 
          createValidationError(
            VALIDATION_ERROR_CODES.SCHEMA_MISMATCH,
            error.message,
            error.path,
            data,
            undefined,
            undefined,
            { zodError: error }
          )
        );
        
        return createValidationResult(false, errors);
      }

      // Then, apply custom validation rules
      const ruleResults = this.applyValidationRules(zodResult.data);
      
      // Check performance constraints
      const performanceResult = this.validatePerformanceConstraints();
      
      // Merge all results
      const finalResult = mergeValidationResults(
        createValidationResult(true), // Zod validation passed
        ruleResults,
        performanceResult
      );

      // Add metadata
      finalResult.metadata = {
        validationTime: Date.now() - startTime,
        ruleCount: this._rules.length,
        fieldValidatorCount: this._fieldValidators.size,
      };

      return finalResult;

    } catch (error) {
      const errorResult = createValidationError(
        VALIDATION_ERROR_CODES.CUSTOM_VALIDATION_FAILED,
        `Validation failed with error: ${error instanceof Error ? error.message : String(error)}`,
        [],
        data,
        undefined,
        undefined,
        { originalError: error }
      );

      return createValidationResult(false, [errorResult]);
    }
  }

  /**
   * Validates a specific field
   */
  validateField(fieldName: string, value: any): ValidationResult {
    const fieldRules = this._fieldValidators.get(fieldName) || [];
    const errors: any[] = [];
    const warnings: any[] = [];

    // Apply field-specific rules
    for (const rule of fieldRules) {
      try {
        const result = rule.validate(value, {
          path: [fieldName],
          options: this._options,
        });

        if (!result.isValid) {
          errors.push(...result.errors);
        }
        warnings.push(...result.warnings);
      } catch (error) {
        errors.push(
          createValidationError(
            VALIDATION_ERROR_CODES.CUSTOM_VALIDATION_FAILED,
            `Rule ${rule.name} failed: ${error instanceof Error ? error.message : String(error)}`,
            [fieldName],
            value
          )
        );
      }
    }

    return createValidationResult(errors.length === 0, errors, warnings);
  }

  /**
   * Adds a validation rule
   */
  addRule(rule: ValidationRule): void {
    this._rules.push(rule);
  }

  /**
   * Removes a validation rule by name
   */
  removeRule(ruleName: string): void {
    this._rules = this._rules.filter(rule => rule.name !== ruleName);
  }

  /**
   * Gets a validation rule by name
   */
  getRule(ruleName: string): ValidationRule | undefined {
    return this._rules.find(rule => rule.name === ruleName);
  }

  /**
   * Adds a field-specific validation rule
   */
  addFieldRule(fieldName: string, rule: ValidationRule): void {
    if (!this._fieldValidators.has(fieldName)) {
      this._fieldValidators.set(fieldName, []);
    }
    
    const fieldRules = this._fieldValidators.get(fieldName)!;
    fieldRules.push(rule);
  }

  /**
   * Removes a field-specific validation rule
   */
  removeFieldRule(fieldName: string, ruleName: string): void {
    const fieldRules = this._fieldValidators.get(fieldName);
    if (fieldRules) {
      const updatedRules = fieldRules.filter(rule => rule.name !== ruleName);
      if (updatedRules.length === 0) {
        this._fieldValidators.delete(fieldName);
      } else {
        this._fieldValidators.set(fieldName, updatedRules);
      }
    }
  }

  /**
   * Applies all validation rules to the data
   */
  private applyValidationRules(data: T): ValidationResult {
    const allErrors: any[] = [];
    const allWarnings: any[] = [];

    for (const rule of this._rules) {
      try {
        const result = rule.validate(data, {
          data: data as Record<string, any>,
          options: this._options,
        });

        if (!result.isValid) {
          allErrors.push(...result.errors);
          
          if (this._options.abortEarly) {
            break;
          }
        }
        
        allWarnings.push(...result.warnings);
      } catch (error) {
        allErrors.push(
          createValidationError(
            VALIDATION_ERROR_CODES.CUSTOM_VALIDATION_FAILED,
            `Rule ${rule.name} failed: ${error instanceof Error ? error.message : String(error)}`,
            [],
            data
          )
        );
        
        if (this._options.abortEarly) {
          break;
        }
      }
    }

    return createValidationResult(allErrors.length === 0, allErrors, allWarnings);
  }

  /**
   * Validates performance constraints
   */
  private validatePerformanceConstraints(): ValidationResult {
    const warnings: any[] = [];

    if (this._rules.length > 50) {
      warnings.push(
        createValidationWarning(
          VALIDATION_WARNING_CODES.PERFORMANCE_ISSUE,
          `High number of validation rules (${this._rules.length}), consider optimizing`,
          [],
          this._rules.length,
          'Review and consolidate validation rules'
        )
      );
    }

    if (this._fieldValidators.size > 100) {
      warnings.push(
        createValidationWarning(
          VALIDATION_WARNING_CODES.PERFORMANCE_ISSUE,
          `High number of field validators (${this._fieldValidators.size}), consider optimizing`,
          [],
          this._fieldValidators.size,
          'Review field validation strategy'
        )
      );
    }

    return createValidationResult(true, [], warnings);
  }

  /**
   * Creates a schema validator from Prisma schema fields
   */
  static fromPrismaFields(
    fields: Record<string, SchemaField>,
    options: Partial<ValidationOptions> = {}
  ): SchemaValidator<Record<string, any>> {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    for (const [fieldName, field] of Object.entries(fields)) {
      schemaObject[fieldName] = createZodSchemaFromField(field);
    }

    const schema = z.object(schemaObject);
    return new SchemaValidator(schema, options);
  }

  /**
   * Creates a schema validator from a Zod schema
   */
  static fromZodSchema<T>(
    schema: z.ZodType<T>,
    options: Partial<ValidationOptions> = {}
  ): SchemaValidator<T> {
    return new SchemaValidator(schema, options);
  }

  /**
   * Merges multiple schema validators
   */
  static merge<T extends Record<string, any>>(
    ...validators: SchemaValidator<any>[]
  ): SchemaValidator<T> {
    const mergedSchemas: Record<string, z.ZodTypeAny> = {};
    const mergedRules: ValidationRule[] = [];
    const mergedOptions: ValidationOptions = { ...DEFAULT_VALIDATION_OPTIONS };

    for (const validator of validators) {
      // Merge schemas (this is a simplified approach)
      if (validator.schema instanceof z.ZodObject) {
        const shape = validator.schema.shape;
        Object.assign(mergedSchemas, shape);
      }

      // Merge rules
      mergedRules.push(...validator.rules);

      // Merge options (take the most restrictive)
      Object.assign(mergedOptions, validator.options);
    }

    const mergedSchema = z.object(mergedSchemas);
    const mergedValidator = new SchemaValidator(mergedSchema, mergedOptions);
    
    // Add all rules
    for (const rule of mergedRules) {
      mergedValidator.addRule(rule);
    }

    return mergedValidator;
  }
}