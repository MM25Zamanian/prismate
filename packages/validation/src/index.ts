// Validation module exports for Prismate

// Main classes
export { SchemaValidator } from './schema-validator';

// Types
export * from './types';

// Constants
export * from './constants';

// Utilities
export * from './utils';

// Re-export commonly used types for convenience
export type {
  ValidationRule,
  ValidationContext,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationOptions,
  ISchemaValidator,
  IFieldValidator,
  IModelValidator,
  ValidationCache,
  CustomValidator,
  ValidationRuleFactory,
  ZodSchemaBuilder
} from './types';

// Re-export commonly used constants
export {
  DEFAULT_VALIDATION_OPTIONS,
  DEFAULT_CACHE_OPTIONS,
  BUILT_IN_RULES,
  VALIDATION_ERROR_CODES,
  VALIDATION_WARNING_CODES,
  FIELD_TYPE_MAPPINGS,
  FIELD_MODIFIER_MAPPINGS,
  VALIDATION_SEVERITY,
  VALIDATION_PATTERNS,
  VALIDATION_PERFORMANCE_THRESHOLDS
} from './constants';

// Re-export commonly used utilities
export {
  createValidationResult,
  createValidationError,
  createValidationWarning,
  mergeValidationResults,
  validateRequired,
  validateFieldType,
  validateFieldLength,
  validateFieldRange,
  validateFieldPattern,
  validateEmail,
  validateUrl,
  validateUuid,
  createZodSchemaFromField,
  validatePerformanceConstraints
} from './utils';