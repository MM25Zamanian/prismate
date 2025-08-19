// Client module exports for Prismate

// Main classes
export { PrismaClientManager } from './prisma-client-manager';

// Types
export * from './types';

// Constants
export * from './constants';

// Utilities
export * from './utils';

// Re-export commonly used types for convenience
export type {
  ExcludedKeys,
  ModelDelegates,
  ModelName,
  Models,
  IClientManager,
  ClientConfig,
  ClientLifecycle
} from './types';

// Re-export commonly used constants
export {
  DEFAULT_CLIENT_CONFIG,
  INTERNAL_METHOD_PREFIXES,
  EXCLUDED_METHODS,
  CLIENT_ERROR_MESSAGES,
  LOG_LEVELS
} from './constants';

// Re-export commonly used utilities
export {
  isModelKey,
  normalizeModelName,
  extractModelNames,
  validateModelName,
  createSafeOperation,
  formatClientError
} from './utils';