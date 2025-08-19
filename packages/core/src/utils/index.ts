// Utility functions for Prismate

export * from './string';
export * from './object';
export * from './validation';
export * from './error';
export * from './performance';

export const isEmpty = (value: unknown): boolean => {
	if (value == null) return true;
	if (typeof value === 'string') return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0;
	return false;
}; 