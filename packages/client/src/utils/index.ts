import { camelCase } from 'change-case';
import { INTERNAL_METHOD_PREFIXES, EXCLUDED_METHODS } from '../constants';

/**
 * Determines if a key represents a model (not an internal Prisma method)
 */
export function isModelKey(key: string): boolean {
  return (
    !INTERNAL_METHOD_PREFIXES.some(prefix => key.startsWith(prefix)) &&
    !EXCLUDED_METHODS.includes(key as any) &&
    typeof key === 'string' &&
    key.length > 0
  );
}

/**
 * Converts a model name to camelCase format
 */
export function normalizeModelName(name: string): string {
  return camelCase(name);
}

/**
 * Safely extracts model names from a client instance
 */
export function extractModelNames<TClient extends Record<string, any>>(
  client: TClient
): string[] {
  if (!client) return [];

  return Object.keys(client)
    .filter(isModelKey)
    .map(normalizeModelName);
}

/**
 * Validates if a model name exists in the client
 */
export function validateModelName<TClient extends Record<string, any>>(
  client: TClient,
  modelName: string
): boolean {
  if (!client) return false;
  
  const normalizedName = normalizeModelName(modelName);
  const availableModels = extractModelNames(client);
  
  return availableModels.includes(normalizedName);
}

/**
 * Creates a safe operation wrapper that handles client availability
 */
export function createSafeOperation<TClient, R>(
  client: TClient,
  operation: (client: NonNullable<TClient>) => Promise<R>
): () => Promise<R | null> {
  return async () => {
    if (!client) return null;
    
    try {
      return await operation(client);
    } catch (error) {
      console.error('Operation failed:', error);
      throw error;
    }
  };
}

/**
 * Formats error messages for client operations
 */
export function formatClientError(
  operation: string,
  model?: string,
  details?: string
): string {
  let message = `Client operation failed: ${operation}`;
  
  if (model) {
    message += ` on model ${model}`;
  }
  
  if (details) {
    message += ` - ${details}`;
  }
  
  return message;
}