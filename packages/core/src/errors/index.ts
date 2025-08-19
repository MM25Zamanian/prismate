// Error types and classes for Prismate

// Base error class for Prismate
export class PrismateError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PrismateError';
    // Store the code and details for access
    this.code = code;
    this.details = details;
  }
}

// Specific error types
export class ValidationError extends PrismateError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', { field, value });
    this.name = 'ValidationError';
  }
}

export class SchemaError extends PrismateError {
  constructor(
    message: string,
    public readonly model?: string,
    public readonly field?: string
  ) {
    super(message, 'SCHEMA_ERROR', { model, field });
    this.name = 'SchemaError';
  }
}

export class ClientError extends PrismateError {
  constructor(
    message: string,
    public readonly operation?: string
  ) {
    super(message, 'CLIENT_ERROR', { operation });
    this.name = 'ClientError';
  }
}

export class OperationError extends PrismateError {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly model?: string
  ) {
    super(message, 'OPERATION_ERROR', { operation, model });
    this.name = 'OperationError';
  }
}

export class CacheError extends PrismateError {
  constructor(
    message: string,
    public readonly operation: string
  ) {
    super(message, 'CACHE_ERROR', { operation });
    this.name = 'CacheError';
  }
}

// Error factory functions
export const createValidationError = (
  message: string,
  field?: string,
  value?: unknown
): ValidationError => new ValidationError(message, field, value);

export const createSchemaError = (
  message: string,
  model?: string,
  field?: string
): SchemaError => new SchemaError(message, model, field);

export const createClientError = (
  message: string,
  operation?: string
): ClientError => new ClientError(message, operation);

export const createOperationError = (
  message: string,
  operation: string,
  model?: string
): OperationError => new OperationError(message, operation, model);

export const createCacheError = (
  message: string,
  operation: string
): CacheError => new CacheError(message, operation);

// Error codes enum
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SCHEMA_ERROR: 'SCHEMA_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  OPERATION_ERROR: 'OPERATION_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// Error type guard functions
export const isPrismateError = (error: unknown): error is PrismateError => {
  return error instanceof PrismateError;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isSchemaError = (error: unknown): error is SchemaError => {
  return error instanceof SchemaError;
};

export const isClientError = (error: unknown): error is ClientError => {
  return error instanceof ClientError;
};

export const isOperationError = (error: unknown): error is OperationError => {
  return error instanceof OperationError;
};

export const isCacheError = (error: unknown): error is CacheError => {
  return error instanceof CacheError;
}; 