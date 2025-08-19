// Core module exports for Prismate

// Types
export * from './types';

// Constants
export * from './constants';

// Utilities
export * from './utils';

// Errors
export * from './errors';

// Re-export commonly used types for convenience
export type {
  SchemaField,
  DMMFModel,
  DMMFField,
  DMMF,
  Schemas,
  ModelName,
  Models,
  PrismaClientWrapper,
  SchemaManager,
  CreateInput,
  FindManyInput,
  FindUniqueInput,
  UpdateInput,
  DeleteInput,
  CountInput,
  AggregateInput,
  ValidationResult,
  Validator,
  SchemaValidator,
  Result,
  AsyncResult,
  PaginationOptions,
  PaginationResult,
  SortOrder,
  SortOption,
  FilterCondition,
  FilterGroup,
  QueryOptions,
  CacheOptions,
  CacheStats,
  Lifecycle,
  Configurable
} from './types';

// Re-export commonly used constants
export {
  PRISMA_FIELD_TYPES,
  PRISMA_FIELD_KINDS,
  DEFAULT_CACHE_OPTIONS,
  ERROR_MESSAGES,
  VALIDATION_RULES,
  HTTP_STATUS
} from './constants';

// Re-export commonly used utilities
export {
  deepClone,
  deepMerge,
  pick,
  omit,
  isEmpty, // backward-compatible alias
  isEmptyObject,
  get,
  set,
  flatten,
  isDefined,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isDate,
  isValidEmail,
  isValidUrl,
  isInRange,
  isStringLengthValid,
  validateRequired,
  formatError,
  getErrorDetails,
  isRetryableError,
  createUserFriendlyMessage,
  logError,
  // string utils
  toCamelCase,
  toPascalCase,
  toKebabCase,
  toSnakeCase,
  capitalize,
  uncapitalize,
  isEmptyString,
  truncate,
  randomString
} from './utils';

// Re-export error classes and utilities
export {
  PrismateError,
  ValidationError,
  SchemaError,
  ClientError,
  OperationError,
  CacheError,
  createValidationError,
  createSchemaError,
  createClientError,
  createOperationError,
  createCacheError,
  ERROR_CODES,
  isPrismateError,
  isValidationError,
  isSchemaError,
  isClientError,
  isOperationError,
  isCacheError
} from './errors'; 