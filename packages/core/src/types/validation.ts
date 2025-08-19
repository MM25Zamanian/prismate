// Validation-related type definitions

import { z } from "zod";

// Input types for CRUD operations
export type CreateInput<T = Record<string, unknown>> = {
  model: string;
  data: T;
};

export type FindManyInput<TSelect = unknown, TInclude = unknown, TWhere = Record<string, unknown>, TOrderBy = unknown> = {
  model: string;
  where?: TWhere;
  select?: TSelect;
  include?: TInclude;
  orderBy?: TOrderBy;
  take?: number;
  skip?: number;
};

export type FindUniqueInput<TSelect = unknown, TInclude = unknown, TWhere = Record<string, unknown>> = {
  model: string;
  where: TWhere;
  select?: TSelect;
  include?: TInclude;
};

export type UpdateInput<TData = Record<string, unknown>, TSelect = unknown, TInclude = unknown, TWhere = Record<string, unknown>> = {
  model: string;
  where: TWhere;
  data: TData;
  select?: TSelect;
  include?: TInclude;
};

export type DeleteInput<TSelect = unknown, TInclude = unknown, TWhere = Record<string, unknown>> = {
  model: string;
  where: TWhere;
  select?: TSelect;
  include?: TInclude;
};

export type CountInput<TWhere = Record<string, unknown>> = {
  model: string;
  where?: TWhere;
};

export type AggregateInput<TWhere = Record<string, unknown>, TAggregateFields = Record<string, unknown>> = {
  model: string;
  where?: TWhere;
  _count?: TAggregateFields;
  _avg?: TAggregateFields;
  _sum?: TAggregateFields;
  _min?: TAggregateFields;
  _max?: TAggregateFields;
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
export interface SchemaValidator {
  validateData(model: string, data: Record<string, unknown>): Record<string, unknown>;
  getOrCreateZodSchema(model: string): z.ZodTypeAny;
  createZodSchema(model: string): z.ZodTypeAny;
  mapFieldToZod(field: Record<string, unknown>): z.ZodTypeAny;
  getBaseZodType(fieldType: string): z.ZodTypeAny;
} 