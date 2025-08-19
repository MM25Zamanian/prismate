// Error utility functions

import { PrismateError } from '../errors';

/**
 * Formats an error message consistently
 */
export const formatError = (error: unknown): string => {
  if (error instanceof PrismateError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
};

/**
 * Gets error details for debugging
 */
export const getErrorDetails = (error: unknown): Record<string, unknown> => {
  if (error instanceof PrismateError) {
    return {
      name: error.name,
      code: error.code,
      message: error.message,
      details: error.details,
      stack: error.stack
    };
  }
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  return {
    type: typeof error,
    value: error
  };
};

/**
 * Checks if an error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof PrismateError) {
    // Client errors are usually retryable
    return error.code === 'CLIENT_ERROR';
  }
  
  // Network errors are usually retryable
  if (error instanceof Error) {
    const retryableMessages = [
      'network',
      'timeout',
      'connection',
      'temporary',
      'rate limit'
    ];
    
    return retryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  }
  
  return false;
};

/**
 * Creates a user-friendly error message
 */
export const createUserFriendlyMessage = (error: unknown): string => {
  if (error instanceof PrismateError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return 'The provided data is invalid. Please check your input and try again.';
      case 'SCHEMA_ERROR':
        return 'There was a problem with the data structure. Please contact support.';
      case 'CLIENT_ERROR':
        return 'Unable to connect to the database. Please try again later.';
      case 'OPERATION_ERROR':
        return 'The operation could not be completed. Please try again.';
      case 'CACHE_ERROR':
        return 'There was a temporary issue. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  return 'Something went wrong. Please try again.';
};

/**
 * Logs an error with context
 */
export const logError = (
  error: unknown, 
  context?: Record<string, unknown>
): void => {
  const errorDetails = getErrorDetails(error);
  const logData = {
    timestamp: new Date().toISOString(),
    error: errorDetails,
    context: context ?? {}
  };
  
   
  (globalThis as { console?: { error: (message: string, data: string) => void } }).console?.error('Prismate Error:', JSON.stringify(logData, null, 2));
}; 