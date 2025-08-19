// Error types and classes for Prismate

// Base error class for Prismate
export class PrismateError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly details?: Readonly<Record<string, unknown>>,
		public readonly cause?: unknown
	) {
		super(message);
		this.name = 'PrismateError';
	}
}

// Specific error types
export class ValidationError extends PrismateError {
	constructor(
		message: string,
		public readonly field?: string,
		public readonly value?: unknown,
		metadata?: Readonly<Record<string, unknown>>,
		cause?: unknown
	) {
		super(message, 'VALIDATION_ERROR', { field, value, ...metadata }, cause);
		this.name = 'ValidationError';
	}
}

export class SchemaError extends PrismateError {
	constructor(
		message: string,
		public readonly model?: string,
		public readonly field?: string,
		metadata?: Readonly<Record<string, unknown>>,
		cause?: unknown
	) {
		super(message, 'SCHEMA_ERROR', { model, field, ...metadata }, cause);
		this.name = 'SchemaError';
	}
}

export class ClientError extends PrismateError {
	constructor(
		message: string,
		public readonly operation?: string,
		metadata?: Readonly<Record<string, unknown>>,
		cause?: unknown
	) {
		super(message, 'CLIENT_ERROR', { operation, ...metadata }, cause);
		this.name = 'ClientError';
	}
}

export class OperationError extends PrismateError {
	constructor(
		message: string,
		public readonly operation: string,
		public readonly model?: string,
		metadata?: Readonly<Record<string, unknown>>,
		cause?: unknown
	) {
		super(message, 'OPERATION_ERROR', { operation, model, ...metadata }, cause);
		this.name = 'OperationError';
	}
}

export class CacheError extends PrismateError {
	constructor(
		message: string,
		public readonly operation: string,
		metadata?: Readonly<Record<string, unknown>>,
		cause?: unknown
	) {
		super(message, 'CACHE_ERROR', { operation, ...metadata }, cause);
		this.name = 'CacheError';
	}
}

// Error factory functions
export const createValidationError = (
	message: string,
	context: {
		field?: string;
		value?: unknown;
		code?: string;
		metadata?: Readonly<Record<string, unknown>>;
		cause?: unknown;
	} = {}
): ValidationError => {
	const { field, value, metadata, cause } = context;
	return new ValidationError(message, field, value, metadata, cause);
};

export const createSchemaError = (
	message: string,
	context: {
		model?: string;
		field?: string;
		metadata?: Readonly<Record<string, unknown>>;
		cause?: unknown;
	} = {}
): SchemaError => {
	const { model, field, metadata, cause } = context;
	return new SchemaError(message, model, field, metadata, cause);
};

export const createClientError = (
	message: string,
	context: {
		operation?: string;
		metadata?: Readonly<Record<string, unknown>>;
		cause?: unknown;
	} = {}
): ClientError => {
	const { operation, metadata, cause } = context;
	return new ClientError(message, operation, metadata, cause);
};

export const createOperationError = (
	message: string,
	context: {
		operation: string;
		model?: string;
		metadata?: Readonly<Record<string, unknown>>;
		cause?: unknown;
	}
): OperationError => {
	const { operation, model, metadata, cause } = context;
	return new OperationError(message, operation, model, metadata, cause);
};

export const createCacheError = (
	message: string,
	context: {
		operation: string;
		metadata?: Readonly<Record<string, unknown>>;
		cause?: unknown;
	}
): CacheError => {
	const { operation, metadata, cause } = context;
	return new CacheError(message, operation, metadata, cause);
};

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