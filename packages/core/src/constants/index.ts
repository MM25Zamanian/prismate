// Core constants for Prismate

// Prisma field types
export const PRISMA_FIELD_TYPES = {
  STRING: 'String',
  INT: 'Int',
  FLOAT: 'Float',
  BIGINT: 'BigInt',
  DATETIME: 'DateTime',
  BOOLEAN: 'Boolean',
  JSON: 'Json',
  BYTES: 'Bytes',
  DECIMAL: 'Decimal',
} as const;

// Prisma field kinds
export const PRISMA_FIELD_KINDS = {
  SCALAR: 'scalar',
  OBJECT: 'object',
  ENUM: 'enum',
  UNSUPPORTED: 'unsupported',
} as const;

// Default cache settings
export const DEFAULT_CACHE_OPTIONS = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 1000,
  CLEANUP_INTERVAL: 60 * 1000, // 1 minute
} as const;

// Error messages
export const ERROR_MESSAGES = {
  CLIENT_NOT_AVAILABLE: 'No database client available',
  MODEL_NOT_FOUND: 'Model not found in schemas',
  VALIDATION_FAILED: 'Validation failed',
  OPERATION_FAILED: 'Operation failed',
  INVALID_INPUT: 'Invalid input data',
  SCHEMA_ERROR: 'Schema error',
} as const;

// Validation rules
export const VALIDATION_RULES = {
  MAX_STRING_LENGTH: 1000,
  MAX_ARRAY_LENGTH: 10000,
  MAX_OBJECT_DEPTH: 10,
} as const;

// HTTP status codes for API responses
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const; 