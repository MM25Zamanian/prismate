import { z } from 'zod';
import type { 
  ValidationResult, 
  ValidationError, 
  ValidationWarning, 
  ValidationContext,
  SchemaField 
} from '../types';
import { 
  VALIDATION_ERROR_CODES, 
  VALIDATION_WARNING_CODES,
  VALIDATION_PATTERNS,
  VALIDATION_PERFORMANCE_THRESHOLDS
} from '../constants';

/**
 * Creates a validation result object
 */
export function createValidationResult(
  isValid: boolean,
  errors: ValidationError[] = [],
  warnings: ValidationWarning[] = [],
  metadata?: Record<string, any>
): ValidationResult {
  return {
    isValid,
    errors: [...errors],
    warnings: [...warnings],
    metadata,
  };
}

/**
 * Creates a validation error object
 */
export function createValidationError(
  code: string,
  message: string,
  path: string[] = [],
  value?: any,
  expected?: any,
  received?: any,
  context?: Record<string, any>
): ValidationError {
  return {
    code,
    message,
    path: [...path],
    value,
    expected,
    received,
    context,
  };
}

/**
 * Creates a validation warning object
 */
export function createValidationWarning(
  code: string,
  message: string,
  path: string[] = [],
  value?: any,
  suggestion?: string,
  context?: Record<string, any>
): ValidationWarning {
  return {
    code,
    message,
    path: [...path],
    value,
    suggestion,
    context,
  };
}

/**
 * Merges multiple validation results
 */
export function mergeValidationResults(
  ...results: ValidationResult[]
): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];
  let isValid = true;

  for (const result of results) {
    if (!result.isValid) {
      isValid = false;
    }
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  return createValidationResult(isValid, allErrors, allWarnings);
}

/**
 * Validates if a value is required
 */
export function validateRequired(
  value: any,
  context?: ValidationContext
): ValidationResult {
  const isMissing = value === undefined || value === null || value === '';
  
  if (isMissing) {
    const error = createValidationError(
      VALIDATION_ERROR_CODES.REQUIRED_FIELD_MISSING,
      'Field is required',
      context?.path || [],
      value
    );
    
    return createValidationResult(false, [error]);
  }

  return createValidationResult(true);
}

/**
 * Validates field type
 */
export function validateFieldType(
  value: any,
  field: SchemaField,
  context?: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Basic type validation
  switch (field.type) {
    case 'String':
      if (typeof value !== 'string') {
        errors.push(createValidationError(
          VALIDATION_ERROR_CODES.INVALID_TYPE,
          `Expected string, got ${typeof value}`,
          context?.path || [],
          value,
          'string',
          typeof value
        ));
      }
      break;
      
    case 'Int':
    case 'Float':
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        errors.push(createValidationError(
          VALIDATION_ERROR_CODES.INVALID_TYPE,
          `Expected number, got ${typeof value}`,
          context?.path || [],
          value,
          'number',
          typeof value
        ));
      }
      break;
      
    case 'Boolean':
      if (typeof value !== 'boolean') {
        errors.push(createValidationError(
          VALIDATION_ERROR_CODES.INVALID_TYPE,
          `Expected boolean, got ${typeof value}`,
          context?.path || [],
          value,
          'boolean',
          typeof value
        ));
      }
      break;
      
    case 'DateTime':
      if (!(value instanceof Date) && isNaN(Date.parse(value))) {
        errors.push(createValidationError(
          VALIDATION_ERROR_CODES.INVALID_TYPE,
          'Expected valid date',
          context?.path || [],
          value,
          'Date',
          typeof value
        ));
      }
      break;
      
    case 'Json':
      // JSON values are always valid
      break;
      
    default:
      // For unknown types, assume valid
      break;
  }

  return createValidationResult(errors.length === 0, errors);
}

/**
 * Validates field length constraints
 */
export function validateFieldLength(
  value: any,
  field: SchemaField,
  context?: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (field.type === 'String' && typeof value === 'string') {
    // Add length validation logic here if needed
    // This would depend on your specific requirements
  }

  return createValidationResult(errors.length === 0, errors);
}

/**
 * Validates field range constraints
 */
export function validateFieldRange(
  value: any,
  field: SchemaField,
  context?: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  
  if ((field.type === 'Int' || field.type === 'Float') && typeof value === 'number') {
    // Add range validation logic here if needed
    // This would depend on your specific requirements
  }

  return createValidationResult(errors.length === 0, errors);
}

/**
 * Validates field pattern constraints
 */
export function validateFieldPattern(
  value: any,
  field: SchemaField,
  context?: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (field.type === 'String' && typeof value === 'string') {
    // Add pattern validation logic here if needed
    // This would depend on your specific requirements
  }

  return createValidationResult(errors.length === 0, errors);
}

/**
 * Validates email format
 */
export function validateEmail(
  value: string,
  context?: ValidationContext
): ValidationResult {
  if (!VALIDATION_PATTERNS.EMAIL.test(value)) {
    const error = createValidationError(
      VALIDATION_ERROR_CODES.INVALID_PATTERN,
      'Invalid email format',
      context?.path || [],
      value
    );
    
    return createValidationResult(false, [error]);
  }

  return createValidationResult(true);
}

/**
 * Validates URL format
 */
export function validateUrl(
  value: string,
  context?: ValidationContext
): ValidationResult {
  if (!VALIDATION_PATTERNS.URL.test(value)) {
    const error = createValidationError(
      VALIDATION_ERROR_CODES.INVALID_PATTERN,
      'Invalid URL format',
      context?.path || [],
      value
    );
    
    return createValidationResult(false, [error]);
  }

  return createValidationResult(true);
}

/**
 * Validates UUID format
 */
export function validateUuid(
  value: string,
  context?: ValidationContext
): ValidationResult {
  if (!VALIDATION_PATTERNS.UUID.test(value)) {
    const error = createValidationError(
      VALIDATION_ERROR_CODES.INVALID_PATTERN,
      'Invalid UUID format',
      context?.path || [],
      value
    );
    
    return createValidationResult(false, [error]);
  }

  return createValidationResult(true);
}

/**
 * Creates a Zod schema from a Prisma field
 */
export function createZodSchemaFromField(field: SchemaField): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  // Base type
  switch (field.type) {
    case 'String':
      schema = z.string();
      break;
    case 'Int':
      schema = z.number().int();
      break;
    case 'Float':
      schema = z.number();
      break;
    case 'Boolean':
      schema = z.boolean();
      break;
    case 'DateTime':
      schema = z.date();
      break;
    case 'Json':
      schema = z.any();
      break;
    case 'BigInt':
      schema = z.bigint();
      break;
    case 'Decimal':
      schema = z.number();
      break;
    case 'Bytes':
      schema = z.instanceof(Buffer);
      break;
    default:
      schema = z.any();
  }

  // Apply modifiers
  if (field.isList) {
    schema = z.array(schema);
  }

  if (!field.isRequired) {
    schema = schema.optional();
  }

  if (field.hasDefaultValue && field.default !== undefined) {
    schema = schema.default(field.default);
  }

  return schema;
}

/**
 * Validates performance constraints
 */
export function validatePerformanceConstraints(
  fieldCount: number,
  ruleCount: number,
  context?: ValidationContext
): ValidationResult {
  const warnings: ValidationWarning[] = [];

  if (fieldCount > VALIDATION_PERFORMANCE_THRESHOLDS.MAX_FIELDS_PER_MODEL) {
    warnings.push(createValidationWarning(
      VALIDATION_WARNING_CODES.PERFORMANCE_ISSUE,
      `Model has ${fieldCount} fields, consider splitting for better performance`,
      context?.path || [],
      fieldCount,
      'Split model into smaller models'
    ));
  }

  if (ruleCount > VALIDATION_PERFORMANCE_THRESHOLDS.MAX_VALIDATION_RULES) {
    warnings.push(createValidationWarning(
      VALIDATION_WARNING_CODES.PERFORMANCE_ISSUE,
      `Model has ${ruleCount} validation rules, consider optimizing`,
      context?.path || [],
      ruleCount,
      'Review and optimize validation rules'
    ));
  }

  return createValidationResult(true, [], warnings);
}