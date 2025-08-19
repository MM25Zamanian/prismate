// Validation-related type definitions

import type { z } from "zod";

// Input types for CRUD operations
export type CreateInput = {
  model: string;
  data: Record<string, unknown>;
};

export type FindManyInput = {
  model: string;
  where?: Record<string, unknown>;
  select?: Record<string, boolean>;
  include?: Record<string, boolean>;
  orderBy?: Record<string, unknown>;
  take?: number;
  skip?: number;
};

export type FindUniqueInput = {
  model: string;
  where: Record<string, unknown>;
  select?: Record<string, boolean>;
  include?: Record<string, boolean>;
};

export type UpdateInput = {
  model: string;
  where: Record<string, unknown>;
  data: Record<string, unknown>;
  select?: Record<string, boolean>;
  include?: Record<string, boolean>;
};

export type DeleteInput = {
  model: string;
  where: Record<string, unknown>;
  select?: Record<string, boolean>;
  include?: Record<string, boolean>;
};

export type CountInput = {
  model: string;
  where?: Record<string, unknown>;
};

export type AggregateInput = {
  model: string;
  where?: Record<string, unknown>;
  _count?: Record<string, unknown>;
  _avg?: Record<string, unknown>;
  _sum?: Record<string, unknown>;
  _min?: Record<string, unknown>;
  _max?: Record<string, unknown>;
};

// Validation result types
export type ValidationResult<T> = {
  success: true;
  data: T;  
} | {
  success: false;
  errors: string[];
};

// Validator interface
export interface Validator<T> {
  validate(data: unknown): ValidationResult<T>;
  validateAsync(data: unknown): Promise<ValidationResult<T>>;
}

// Schema validator interface
export interface SchemaValidator<TDMMF> {
  validateData(model: string, data: Record<string, unknown>): Record<string, unknown>;  
  getOrCreateZodSchema(model: string): z.ZodTypeAny;  
  createZodSchema(model: string): z.ZodTypeAny;  
  mapFieldToZod(field: Record<string, unknown>): z.ZodTypeAny;  
  getBaseZodType(fieldType: string): z.ZodTypeAny;  
} 