import type { z } from "zod";

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

export type ModelDelegates<TClient> = Omit<TClient, ExcludedKeys>;
export type ModelName<TClient> = Extract<keyof ModelDelegates<TClient>, string>;
export type Models<TClient> = readonly ModelName<NonNullable<TClient>>[];

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

export interface DMMFModel {
  readonly name: string;
  readonly fields: readonly DMMFField[];
}

export interface DMMF {
  readonly datamodel?: {
    readonly models?: readonly DMMFModel[];
  };
}

export type DMMFLike = {
  readonly datamodel: {
    readonly models: readonly {
      readonly name: string;
      readonly fields: readonly { readonly name: string }[];
    }[];
  };
};

export type ModelKeysFromDMMF<TDMMF> = TDMMF extends DMMFLike
  ? Uncapitalize<TDMMF["datamodel"]["models"][number]["name"]>
  : string;

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

export type Schemas<TDMMF> = {
  readonly [M in ModelKeysFromDMMF<TDMMF>]: Readonly<{
    readonly [F in FieldNamesFromDMMF<TDMMF, M>]: SchemaField;
  }>;
};

export type SchemaCache = Map<string, z.ZodTypeAny>;

export interface CacheConfig {
  readonly maxSize?: number;
  readonly ttlMs?: number;
}

export interface CacheStats {
  readonly size: number;
  readonly maxSize?: number;
  readonly ttlMs?: number;
}

export interface PrismateModel {
  readonly name: string;
  readonly fields: readonly SchemaField[];
  readonly relations: readonly { field: string; target: string }[];
}
