// Schema parsing defaults
export const DEFAULT_SCHEMA_OPTIONS = {
  includeRelations: true,
  includeDefaults: true,
  includeMetadata: true,
  strictMode: false,
  validateTypes: true,
} as const;

// Supported field types
export const SUPPORTED_FIELD_TYPES = [
  'String',
  'Int',
  'Float',
  'Boolean',
  'DateTime',
  'Json',
  'BigInt',
  'Decimal',
  'Bytes',
] as const;

// Supported field kinds
export const SUPPORTED_FIELD_KINDS = [
  'scalar',
  'object',
  'enum',
  'unsupported',
] as const;

// Schema validation rules
export const SCHEMA_VALIDATION_RULES = {
  MIN_MODEL_NAME_LENGTH: 1,
  MAX_MODEL_NAME_LENGTH: 100,
  MIN_FIELD_NAME_LENGTH: 1,
  MAX_FIELD_NAME_LENGTH: 100,
  MAX_MODELS_PER_SCHEMA: 1000,
  MAX_FIELDS_PER_MODEL: 1000,
} as const;

// Error messages
export const SCHEMA_ERROR_MESSAGES = {
  INVALID_DMMF: 'Invalid DMMF data provided',
  NO_MODELS: 'No models found in DMMF data',
  INVALID_MODEL: 'Invalid model structure',
  INVALID_FIELD: 'Invalid field structure',
  UNSUPPORTED_TYPE: 'Unsupported field type',
  UNSUPPORTED_KIND: 'Unsupported field kind',
  DUPLICATE_MODEL: 'Duplicate model name found',
  DUPLICATE_FIELD: 'Duplicate field name found in model',
} as const;

// Schema export formats
export const SUPPORTED_EXPORT_FORMATS = [
  'json',
  'typescript',
  'graphql',
  'prisma',
] as const;

// Schema metadata defaults
export const DEFAULT_SCHEMA_METADATA = {
  version: '1.0.0',
  source: 'prisma-dmmf',
  checksum: '',
} as const;