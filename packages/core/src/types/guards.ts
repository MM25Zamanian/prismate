// Type guard utilities for runtime type checking

/**
 * Type guard to check if a value is defined (not null or undefined)
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Type guard to check if a value is null
 */
export const isNull = (value: unknown): value is null => {
  return value === null;
};

/**
 * Type guard to check if a value is undefined
 */
export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

/**
 * Type guard to check if a value is a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Type guard to check if a value is a number
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Type guard to check if a value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * Type guard to check if a value is an object (but not null, array, or primitive)
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Type guard to check if a value is an array
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

/**
 * Type guard to check if a value is a function
 */
export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown => {
  return typeof value === 'function';
};

/**
 * Type guard to check if a value is a Date object
 */
export const isDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

/**
 * Type guard to check if a value is a Promise
 */
export const isPromise = <T = unknown>(value: unknown): value is Promise<T> => {
  return value instanceof Promise;
};

/**
 * Type guard to check if a value is an Error
 */
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

/**
 * Type guard to check if a value is a RegExp
 */
export const isRegExp = (value: unknown): value is RegExp => {
  return value instanceof RegExp;
};

/**
 * Type guard to check if a value has a specific property
 */
export const hasProperty = <K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> => {
  return isObject(obj) && key in obj;
};

/**
 * Type guard to check if a value has multiple properties
 */
export const hasProperties = <K extends string>(
  obj: unknown,
  keys: readonly K[]
): obj is Record<K, unknown> => {
  if (!isObject(obj)) return false;
  return keys.every(key => key in obj);
};

/**
 * Type guard for checking if a value matches a specific type structure
 */
export const isOfType = <T>(
  value: unknown,
  validator: (val: unknown) => val is T
): value is T => {
  return validator(value);
};

/**
 * Type guard for arrays with specific element type
 */
export const isArrayOf = <T>(
  value: unknown,
  elementGuard: (item: unknown) => item is T
): value is T[] => {
  return isArray(value) && value.every(elementGuard);
};

/**
 * Type guard for non-empty arrays
 */
export const isNonEmptyArray = <T>(
  value: T[]
): value is [T, ...T[]] => {
  return value.length > 0;
};

/**
 * Type guard for checking if a value is one of several literal values
 */
export const isOneOf = <T extends readonly unknown[]>(
  value: unknown,
  options: T
): value is T[number] => {
  return options.includes(value);
};

/**
 * Type guard for checking if a string is a valid email
 */
export const isValidEmail = (value: string): value is string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Type guard for checking if a string is a valid URL
 */
export const isValidUrl = (value: string): value is string => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Type guard for checking if a number is within a range
 */
export const isInRange = (
  value: number,
  min: number,
  max: number
): value is number => {
  return value >= min && value <= max;
};

/**
 * Type guard for checking if a string length is within bounds
 */
export const isStringLengthValid = (
  str: string,
  minLength: number,
  maxLength: number
): str is string => {
  return str.length >= minLength && str.length <= maxLength;
};

/**
 * Assertion function that throws if the condition is false
 */
export const assert = (condition: unknown, message?: string): asserts condition => {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed');
  }
};

/**
 * Assertion function for defined values
 */
export const assertDefined = <T>(
  value: T | null | undefined,
  message?: string
): asserts value is T => {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Value must be defined');
  }
};

/**
 * Assertion function for non-null values
 */
export const assertNotNull = <T>(
  value: T | null,
  message?: string
): asserts value is T => {
  if (value === null) {
    throw new Error(message ?? 'Value must not be null');
  }
};