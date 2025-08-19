/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from "zod";

// Prisma client methods that should be excluded from model operations
export type ExcludedKeys =
  | "$connect"
  | "$disconnect"
  | "$on"
  | "$transaction"
  | "$use"
  | "$extends"
  | "$runCommandRaw"
  | "$queryRaw"
  | "$executeRaw"
  | "$metrics"
  | "$queryRawUnsafe"
  | "$executeRawUnsafe";

// Extract only the model delegate methods from the client
export type ModelDelegates<TClient> = Omit<TClient, ExcludedKeys>;

// Extract model names as string literals
export type ModelName<TClient> = Extract<keyof ModelDelegates<TClient>, string>;

// Comprehensive schema field definition with all Prisma field properties
export interface SchemaField {
  readonly name: string;
  readonly type: string;
  readonly kind: string;
  readonly isRequired: boolean;
  readonly isList: boolean;
  readonly isUnique: boolean;
  readonly isId: boolean;
  readonly relationName?: string;
  readonly relationFromFields?: readonly string[];
  readonly relationToFields?: readonly string[];
  readonly relationOnDelete?: string;
  readonly relationOnUpdate?: string;
  readonly default?: unknown;
  readonly hasDefaultValue: boolean;
}

// DMMF model interface for type safety
export interface DMMFModel {
  readonly name: string;
  readonly fields: readonly DMMFField[];
}

export interface DMMFField {
  readonly name: string;
  readonly type: string;
  readonly kind: string;
  readonly isRequired: boolean;
  readonly isList: boolean;
  readonly isUnique: boolean;
  readonly isId: boolean;
  readonly relationName?: string;
  readonly relationFromFields?: readonly string[];
  readonly relationToFields?: readonly string[];
  readonly relationOnDelete?: string;
  readonly relationOnUpdate?: string;
  readonly default?: unknown;
  readonly hasDefaultValue: boolean;
}

// DMMF structure interface
export interface DMMF {
  readonly datamodel?: {
    readonly models?: readonly DMMFModel[];
  };
}

// DMMF-like structure for type extraction
export type DMMFLike = {
  readonly datamodel: {
    readonly models: readonly {
      readonly name: string;
      readonly fields: readonly { readonly name: string }[];
    }[];
  };
};

// Infer model keys (camelCase) from DMMF at the type level
export type ModelKeysFromDMMF<TDMMF> = TDMMF extends DMMFLike
  ? Uncapitalize<TDMMF["datamodel"]["models"][number]["name"]>
  : string;

// Infer field names for a given model M (camelCase) from DMMF at the type level
export type FieldNamesFromDMMF<TDMMF, M extends string> = TDMMF extends DMMFLike
  ? Extract<
      TDMMF["datamodel"]["models"][number],
      { name: Capitalize<M> }
    > extends { fields: infer TFields }
    ? TFields extends ReadonlyArray<{ name: infer F }>
      ? Extract<F, string>
      : string
    : string
  : string;

// Schemas type driven by TDMMF; falls back to string keys if unknown
export type Schemas<TDMMF> = {
  readonly [M in ModelKeysFromDMMF<TDMMF>]: Readonly<{
    readonly [F in FieldNamesFromDMMF<TDMMF, M>]: SchemaField;
  }>;
};

// Type-safe models array
export type Models<TClient> = readonly ModelName<NonNullable<TClient>>[];

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

// Cache for Zod schemas to improve performance
export type SchemaCache = Map<string, z.ZodTypeAny>;
