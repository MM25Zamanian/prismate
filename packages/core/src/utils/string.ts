// String utility functions

import { camelCase, kebabCase, pascalCase, snakeCase } from 'change-case';

/**
 * Converts a string to camelCase
 */
export const toCamelCase = (str: string): string => camelCase(str);

/**
 * Converts a string to PascalCase
 */
export const toPascalCase = (str: string): string => pascalCase(str);

/**
 * Converts a string to kebab-case
 */
export const toKebabCase = (str: string): string => kebabCase(str);

/**
 * Converts a string to snake_case
 */
export const toSnakeCase = (str: string): string => snakeCase(str);

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Uncapitalizes the first letter of a string
 */
export const uncapitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Checks if a string is empty or contains only whitespace
 */
export const isStringEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Truncates a string to a specified length
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Generates a random string of specified length
 */
export const randomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}; 