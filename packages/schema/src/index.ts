// Schema module exports for Prismate

// Main classes
export { SchemaBuilder } from './schema-builder';

// Types
export * from './types';

// Constants
export * from './constants';

// Utilities
export * from './utils';

// Re-export commonly used types for convenience
export type {
  ISchemaBuilder,
  SchemaParseOptions,
  SchemaValidationResult,
  SchemaMetadata,
  SchemaTransformOptions,
  SchemaExportOptions,
  SchemaExportFormat
} from './types';

// Re-export commonly used constants
export {
  DEFAULT_SCHEMA_OPTIONS,
  SUPPORTED_FIELD_TYPES,
  SUPPORTED_FIELD_KINDS,
  SCHEMA_VALIDATION_RULES,
  SCHEMA_ERROR_MESSAGES,
  SUPPORTED_EXPORT_FORMATS,
  DEFAULT_SCHEMA_METADATA
} from './constants';

// Re-export commonly used utilities
export {
  isValidFieldType,
  isValidFieldKind,
  isValidModelName,
  isValidFieldName,
  normalizeModelName,
  normalizeFieldName,
  createSchemaChecksum,
  validateDMMFModel,
  validateDMMFField,
  checkDuplicateModels,
  checkDuplicateFields
} from './utils';