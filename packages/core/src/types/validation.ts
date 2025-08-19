// Validation-related type definitions

import { z } from "zod";

// Input types for CRUD operations
export type CreateInput = {
  model: string;
  data: any;
};

export type FindManyInput = {
  model: string;
  where?: any;
  select?: any;
  include?: any;
  orderBy?: any;
  take?: number;
  skip?: number;
};

export type FindUniqueInput = {
  model: string;
  where: any;
  select?: any;
  include?: any;
};

export type UpdateInput = {
  model: string;
  where: any;
  data: any;
  select?: any;
  include?: any;
};

export type DeleteInput = {
  model: string;
  where: any;
  select?: any;
  include?: any;
};

export type CountInput = {
  model: string;
  where?: any;
};

export type AggregateInput = {
  model: string;
  where?: any;
  _count?: any;
  _avg?: any;
  _sum?: any;
  _min?: any;
  _max?: any;
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
  validateData(model: string, data: any): any;
  getOrCreateZodSchema(model: string): z.ZodTypeAny;
  createZodSchema(model: string): z.ZodTypeAny;
  mapFieldToZod(field: any): z.ZodTypeAny;
  getBaseZodType(fieldType: string): z.ZodTypeAny;
} 