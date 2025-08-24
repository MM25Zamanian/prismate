import { camelCase } from "change-case";

import type {
  CacheConfig,
  CacheStats,
  DMMF,
  DMMFModel,
  DMMFField,
  Models,
  ModelName,
  PrismateModel,
  SchemaField,
  Schemas,
} from "./types";

type CacheEntry<T> = { value: T; expiresAt?: number };

export class PrismateCore<TClient extends Record<string, unknown> | null | undefined, TDMMF> {
  private readonly client: TClient;
  private readonly dmmf?: DMMF | undefined;

  private readonly schemaCache = new Map<string, CacheEntry<Record<string, SchemaField>>>();
  private readonly modelDefinitionCache = new Map<string, CacheEntry<PrismateModel>>();

  private cacheConfig: CacheConfig = Object.freeze({ maxSize: 200, ttlMs: 5 * 60_000 });

  public readonly models: Models<TClient>;
  public readonly schemas: Schemas<TDMMF>;

  constructor(client: TClient, dmmf?: DMMF, cacheConfig?: CacheConfig) {
    this.client = client;
    this.dmmf = dmmf;
    if (cacheConfig) { this.cacheConfig = Object.freeze({ ...this.cacheConfig, ...cacheConfig }); }

    this.models = this.extractModels(client);
    this.schemas = this.buildSchemas(dmmf) as Schemas<TDMMF>;
  }

  private extractModels(client: TClient): Models<TClient> {
    if (!client) { return [] as unknown as Models<TClient>; }
    const modelNames = Object.keys(client)
      .filter((key) => this.isModelKey(key))
      .map((key) => camelCase(key)) as ModelName<NonNullable<TClient>>[];
    return Object.freeze([...modelNames]);
  }

  private isModelKey(key: string): boolean {
    return !key.startsWith("$") && !key.startsWith("_") && key !== "constructor";
  }

  private buildSchemas(dmmf?: DMMF): Readonly<Record<string, Readonly<Record<string, SchemaField>>>> {
    if (!dmmf?.datamodel?.models) { return Object.freeze({}); }
    const schemas: Record<string, Record<string, SchemaField>> = {};
    for (const model of dmmf.datamodel.models) {
      const camelName = camelCase(model.name);
      if (this.models.includes(camelName as ModelName<NonNullable<TClient>>)) {
        schemas[camelName] = this.buildModelSchema(model);
      }
    }
    return Object.freeze(schemas);
  }

  private buildModelSchema(model: DMMFModel): Readonly<Record<string, SchemaField>> {
    const modelSchema: Record<string, SchemaField> = {};
    for (const field of model.fields) {
      modelSchema[field.name] = this.createSchemaField(field);
    }
    return Object.freeze(modelSchema);
  }

  private createSchemaField(field: DMMFField): SchemaField {
    return Object.freeze({
      name: field.name,
      type: field.type,
      kind: field.kind,
      isRequired: field.isRequired,
      isList: field.isList,
      isUnique: field.isUnique,
      isId: field.isId,
      relationName: field.relationName,
      relationFromFields: field.relationFromFields ? Object.freeze([...field.relationFromFields]) : undefined,
      relationToFields: field.relationToFields ? Object.freeze([...field.relationToFields]) : undefined,
      relationOnDelete: field.relationOnDelete,
      relationOnUpdate: field.relationOnUpdate,
      default: field.default,
      hasDefaultValue: field.hasDefaultValue,
    });
  }

  // Public API
  public getAvailableModels(): readonly string[] {
    return Object.freeze(Object.keys(this.schemas));
  }

  public getModelSchema(model: string): readonly SchemaField[] {
    const schema = this.schemas[model as keyof Schemas<TDMMF>];
    if (!schema) { return Object.freeze([]); }
    return Object.freeze(Object.keys(schema).map((k) => schema[k as keyof typeof schema] as unknown as SchemaField));
  }

  public getModelDefinition(model: string): PrismateModel | undefined {
    const cached = this.getFromCache(this.modelDefinitionCache, model);
    if (cached) { return cached; }
    const schema = this.schemas[model as keyof Schemas<TDMMF>];
    if (!schema) { return undefined; }
    const schemaRecord = schema as unknown as Record<string, SchemaField>;
    const fields: SchemaField[] = Object.values(schemaRecord);
    const relations = fields
      .filter((f) => f.kind === "object" && Boolean(f.relationName))
      .map((f) => ({ field: f.name, target: String(f.type) }));
    const definition: PrismateModel = Object.freeze({ name: model, fields, relations });
    this.setInCache(this.modelDefinitionCache, model, definition);
    return definition;
  }

  public hasModel(model: string): boolean {
    return (this.schemas as Record<string, unknown>)[model] !== undefined;
  }

  public getFieldInfo(model: string, field: string): SchemaField | undefined {
    const schema = this.schemas[model as keyof Schemas<TDMMF>] as Record<string, SchemaField> | undefined;
    return schema?.[field];
  }

  // Cache management
  public getCacheStats(): Readonly<CacheStats> {
    return Object.freeze({ size: this.schemaCache.size + this.modelDefinitionCache.size, maxSize: this.cacheConfig.maxSize, ttlMs: this.cacheConfig.ttlMs });
  }

  public clearCache(): void {
    this.schemaCache.clear();
    this.modelDefinitionCache.clear();
  }

  public updateCacheConfig(config: Partial<CacheConfig>): void {
    this.cacheConfig = Object.freeze({ ...this.cacheConfig, ...config });
    // Proactively evict if size decreased
    this.evictIfNeeded();
  }

  // Utilities
  public getModelSummary(): Readonly<Record<string, { fieldCount: number; relationCount: number }>> {
    const summary: Record<string, { fieldCount: number; relationCount: number }> = {};
    for (const model of this.getAvailableModels()) {
      const fields = this.getModelSchema(model);
      const relationCount = fields.filter((f) => f.kind === "object").length;
      summary[model] = { fieldCount: fields.length, relationCount };
    }
    return Object.freeze(summary);
  }

  public exportSchema(): Readonly<Record<string, unknown>> {
    return Object.freeze({ ...this.schemas });
  }

  public dispose(): void {
    this.clearCache();
  }

  // Internal cache helpers
  private getFromCache<T>(cache: Map<string, CacheEntry<T>>, key: string): T | undefined {
    const entry = cache.get(key);
    if (!entry) { return undefined; }
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  private setInCache<T>(cache: Map<string, CacheEntry<T>>, key: string, value: T): void {
    const expiresAt = this.cacheConfig.ttlMs ? Date.now() + this.cacheConfig.ttlMs : undefined;
    cache.set(key, { value, expiresAt });
    this.evictIfNeeded(cache);
  }

  private evictIfNeeded(cache?: Map<string, unknown>): void {
    const target = cache ?? this.schemaCache;
    const maxSize = this.cacheConfig.maxSize ?? Number.POSITIVE_INFINITY;
    if (target.size <= maxSize) { return; }
    // simple FIFO eviction
    const toDelete = target.size - maxSize;
    const keys = Array.from(target.keys());
    for (let i = 0; i < toDelete && i < keys.length; i++) {
      target.delete(keys[i] as string);
    }
  }
}
