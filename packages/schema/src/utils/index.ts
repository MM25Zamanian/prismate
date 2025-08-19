import { camelCase } from 'change-case';
import { 
  SUPPORTED_FIELD_TYPES, 
  SUPPORTED_FIELD_KINDS,
  SCHEMA_VALIDATION_RULES,
  SCHEMA_ERROR_MESSAGES 
} from '../constants';
import type { DMMFModel, DMMFField, SchemaField } from '@prismate/core';

/**
 * Validates if a field type is supported
 */
export function isValidFieldType(type: string): boolean {
  return SUPPORTED_FIELD_TYPES.includes(type as any);
}

/**
 * Validates if a field kind is supported
 */
export function isValidFieldKind(kind: string): boolean {
  return SUPPORTED_FIELD_KINDS.includes(kind as any);
}

/**
 * Validates model name length
 */
export function isValidModelName(name: string): boolean {
  return (
    name.length >= SCHEMA_VALIDATION_RULES.MIN_MODEL_NAME_LENGTH &&
    name.length <= SCHEMA_VALIDATION_RULES.MAX_MODEL_NAME_LENGTH
  );
}

/**
 * Validates field name length
 */
export function isValidFieldName(name: string): boolean {
  return (
    name.length >= SCHEMA_VALIDATION_RULES.MIN_FIELD_NAME_LENGTH &&
    name.length <= SCHEMA_VALIDATION_RULES.MAX_FIELD_NAME_LENGTH
  );
}

/**
 * Normalizes model name to camelCase
 */
export function normalizeModelName(name: string): string {
  return camelCase(name);
}

/**
 * Normalizes field name to camelCase
 */
export function normalizeFieldName(name: string): string {
  return camelCase(name);
}

/**
 * Creates a checksum for schema data
 */
export function createSchemaChecksum(data: string): string {
  let hash = 0;
  if (data.length === 0) return hash.toString();
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash.toString();
}

/**
 * Validates DMMF model structure
 */
export function validateDMMFModel(model: DMMFModel): string[] {
  const errors: string[] = [];
  
  if (!model.name || !isValidModelName(model.name)) {
    errors.push(SCHEMA_ERROR_MESSAGES.INVALID_MODEL);
  }
  
  if (!Array.isArray(model.fields)) {
    errors.push(SCHEMA_ERROR_MESSAGES.INVALID_MODEL);
  }
  
  return errors;
}

/**
 * Validates DMMF field structure
 */
export function validateDMMFField(field: DMMFField): string[] {
  const errors: string[] = [];
  
  if (!field.name || !isValidFieldName(field.name)) {
    errors.push(SCHEMA_ERROR_MESSAGES.INVALID_FIELD);
  }
  
  if (!field.type || !isValidFieldType(field.type)) {
    errors.push(SCHEMA_ERROR_MESSAGES.UNSUPPORTED_TYPE);
  }
  
  if (!field.kind || !isValidFieldKind(field.kind)) {
    errors.push(SCHEMA_ERROR_MESSAGES.UNSUPPORTED_KIND);
  }
  
  return errors;
}

/**
 * Checks for duplicate model names
 */
export function checkDuplicateModels(models: DMMFModel[]): string[] {
  const errors: string[] = [];
  const modelNames = new Set<string>();
  
  for (const model of models) {
    const normalizedName = normalizeModelName(model.name);
    if (modelNames.has(normalizedName)) {
      errors.push(SCHEMA_ERROR_MESSAGES.DUPLICATE_MODEL);
    }
    modelNames.add(normalizedName);
  }
  
  return errors;
}

/**
 * Checks for duplicate field names within a model
 */
export function checkDuplicateFields(fields: DMMFField[]): string[] {
  const errors: string[] = [];
  const fieldNames = new Set<string>();
  
  for (const field of fields) {
    const normalizedName = normalizeFieldName(field.name);
    if (fieldNames.has(normalizedName)) {
      errors.push(SCHEMA_ERROR_MESSAGES.DUPLICATE_FIELD);
    }
    fieldNames.add(normalizedName);
  }
  
  return errors;
}