// Schema-related type definitions

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

// Schema manager interface
export interface SchemaManager<TDMMF> {
  readonly schemas: Schemas<TDMMF>;
  readonly schemaCount: number;
  getModelSchema(model: string): readonly SchemaField[] | undefined;
  hasModel(model: string): boolean;
  getModelFields(model: string): readonly string[];
  getAvailableModels(): readonly string[];
} 