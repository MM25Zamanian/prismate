// Validation utility functions

/**
 * Checks if a value is defined (not null or undefined)
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Checks if a value is a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Checks if a value is a number
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Checks if a value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * Checks if a value is an object (but not null, array, or primitive)
 */
export const isObject = (value: unknown): value is Record<string, any> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Checks if a value is an array
 */
export const isArray = (value: unknown): value is any[] => {
  return Array.isArray(value);
};

/**
 * Checks if a value is a function
 */
export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};

/**
 * Checks if a value is a Date object
 */
export const isDate = (value: unknown): value is Date => {
  return value instanceof Date;
};

/**
 * Checks if a value is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a value is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if a value is within a specified range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Checks if a string length is within specified bounds
 */
export const isStringLengthValid = (str: string, minLength: number, maxLength: number): boolean => {
  return str.length >= minLength && str.length <= maxLength;
};

/**
 * Validates required fields in an object
 */
export const validateRequired = <T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: (keyof T)[] } => {
  const missingFields = requiredFields.filter(field => !isDefined(obj[field]));
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}; 