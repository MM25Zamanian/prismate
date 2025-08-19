// Validation options defaults
export const DEFAULT_VALIDATION_OPTIONS = {
  strict: false,
  allowUnknown: true,
  coerceTypes: true,
  removeAdditional: false,
  useDefaults: true,
  abortEarly: false,
  cacheResults: true,
} as const;

// Validation cache defaults
export const DEFAULT_CACHE_OPTIONS = {
  maxSize: 1000,
  ttl: 300000, // 5 minutes
} as const;

// Built-in validation rules
export const BUILT_IN_RULES = {
  REQUIRED: 'required',
  TYPE: 'type',
  LENGTH: 'length',
  RANGE: 'range',
  PATTERN: 'pattern',
  UNIQUE: 'unique',
  RELATION: 'relation',
  CUSTOM: 'custom',
} as const;

// Validation error codes
export const VALIDATION_ERROR_CODES = {
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_LENGTH: 'INVALID_LENGTH',
  INVALID_RANGE: 'INVALID_RANGE',
  INVALID_PATTERN: 'INVALID_PATTERN',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',
  INVALID_RELATION: 'INVALID_RELATION',
  CUSTOM_VALIDATION_FAILED: 'CUSTOM_VALIDATION_FAILED',
  UNKNOWN_FIELD: 'UNKNOWN_FIELD',
  SCHEMA_MISMATCH: 'SCHEMA_MISMATCH',
} as const;

// Validation warning codes
export const VALIDATION_WARNING_CODES = {
  DEPRECATED_FIELD: 'DEPRECATED_FIELD',
  UNUSED_FIELD: 'UNUSED_FIELD',
  PERFORMANCE_ISSUE: 'PERFORMANCE_ISSUE',
  BEST_PRACTICE: 'BEST_PRACTICE',
} as const;

// Field type mappings for Zod
export const FIELD_TYPE_MAPPINGS = {
  String: 'z.string()',
  Int: 'z.number().int()',
  Float: 'z.number()',
  Boolean: 'z.boolean()',
  DateTime: 'z.date()',
  Json: 'z.any()',
  BigInt: 'z.bigint()',
  Decimal: 'z.number()',
  Bytes: 'z.instanceof(Buffer)',
} as const;

// Field modifier mappings
export const FIELD_MODIFIER_MAPPINGS = {
  isRequired: 'required',
  isList: 'array',
  isUnique: 'unique',
  isId: 'id',
  hasDefaultValue: 'default',
} as const;

// Validation severity levels
export const VALIDATION_SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHABETIC: /^[a-zA-Z]+$/,
  NUMERIC: /^[0-9]+$/,
} as const;

// Validation performance thresholds
export const VALIDATION_PERFORMANCE_THRESHOLDS = {
  MAX_FIELDS_PER_MODEL: 100,
  MAX_VALIDATION_RULES: 50,
  MAX_CACHE_SIZE: 10000,
  MAX_VALIDATION_TIME: 1000, // milliseconds
} as const;