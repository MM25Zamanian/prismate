// Client configuration defaults
export const DEFAULT_CLIENT_CONFIG = {
  enableLogging: false,
  enableMetrics: false,
  connectionTimeout: 30000, // 30 seconds
  queryTimeout: 10000, // 10 seconds
} as const;

// Internal Prisma method prefixes
export const INTERNAL_METHOD_PREFIXES = ['$', '_'] as const;

// Excluded method names
export const EXCLUDED_METHODS = [
  'constructor',
  'prototype',
  '__proto__',
] as const;

// Error messages
export const CLIENT_ERROR_MESSAGES = {
  CLIENT_NOT_AVAILABLE: 'Prisma client is not available',
  MODEL_NOT_FOUND: 'Model not found in client',
  OPERATION_FAILED: 'Database operation failed',
  INVALID_MODEL_NAME: 'Invalid model name provided',
} as const;

// Logging levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;