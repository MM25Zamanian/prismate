import type { z } from 'zod';
import type { SchemaField } from '@prismate/core';

// Validation rule interface
export interface ValidationRule<T = any> {
  readonly name: string;
  readonly description: string;
  readonly severity: 'error' | 'warning' | 'info';
  readonly validate: (value: T, context?: ValidationContext) => ValidationResult;
}

// Validation context
export interface ValidationContext {
  readonly field?: SchemaField;
  readonly model?: string;
  readonly path?: string[];
  readonly data?: Record<string, any>;
  readonly options?: ValidationOptions;
}

// Validation result
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: ValidationError[];
  readonly warnings: ValidationWarning[];
  readonly metadata?: Record<string, any>;
}

// Validation error
export interface ValidationError {
  readonly code: string;
  readonly message: string;
  readonly path: string[];
  readonly value?: any;
  readonly expected?: any;
  readonly received?: any;
  readonly context?: Record<string, any>;
}

// Validation warning
export interface ValidationWarning {
  readonly code: string;
  readonly message: string;
  readonly path: string[];
  readonly value?: any;
  readonly suggestion?: string;
  readonly context?: Record<string, any>;
}

// Validation options
export interface ValidationOptions {
  readonly strict?: boolean;
  readonly allowUnknown?: boolean;
  readonly coerceTypes?: boolean;
  readonly removeAdditional?: boolean;
  readonly useDefaults?: boolean;
  readonly abortEarly?: boolean;
  readonly cacheResults?: boolean;
}

// Schema validator interface
export interface ISchemaValidator<T = any> {
  readonly schema: z.ZodType<T>;
  readonly rules: ValidationRule[];
  readonly options: ValidationOptions;
  
  validate(data: unknown): ValidationResult;
  validateField(fieldName: string, value: any): ValidationResult;
  addRule(rule: ValidationRule): void;
  removeRule(ruleName: string): void;
  getRule(ruleName: string): ValidationRule | undefined;
}

// Field validator interface
export interface IFieldValidator {
  readonly field: SchemaField;
  readonly rules: ValidationRule[];
  
  validate(value: any, context?: ValidationContext): ValidationResult;
  addRule(rule: ValidationRule): void;
  removeRule(ruleName: string): void;
}

// Model validator interface
export interface IModelValidator {
  readonly model: string;
  readonly fields: Map<string, IFieldValidator>;
  readonly rules: ValidationRule[];
  
  validate(data: Record<string, any>): ValidationResult;
  validateField(fieldName: string, value: any): ValidationResult;
  addFieldValidator(fieldName: string, validator: IFieldValidator): void;
  removeFieldValidator(fieldName: string): void;
}

// Validation cache interface
export interface ValidationCache {
  readonly maxSize: number;
  readonly ttl: number;
  
  get(key: string): ValidationResult | undefined;
  set(key: string, result: ValidationResult): void;
  clear(): void;
  size(): number;
}

// Custom validation function
export type CustomValidator<T = any> = (
  value: T,
  context: ValidationContext
) => ValidationResult | Promise<ValidationResult>;

// Validation rule factory
export type ValidationRuleFactory<T = any> = (
  options?: Record<string, any>
) => ValidationRule<T>;

// Zod schema builder
export interface ZodSchemaBuilder {
  readonly baseSchema: z.ZodTypeAny;
  
  addField(name: string, field: SchemaField): this;
  addValidation(validation: z.ZodTypeAny): this;
  addRule(rule: ValidationRule): this;
  build(): z.ZodTypeAny;
}