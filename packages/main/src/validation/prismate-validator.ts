import { z } from "zod";

import { mapFieldToZod as defaultFieldMapper } from "./field-mappers";

import type { CacheConfig, CacheStats, Schemas, SchemaField } from "../core/types";

type CacheEntry<T> = { value: T; expiresAt?: number };

export type ValidationResult = {
  readonly success: boolean;
  readonly data?: unknown;
  readonly error?: string;
};

export class PrismateValidator<TDMMF> {
  private readonly schemaCache: Map<string, CacheEntry<z.ZodTypeAny>> = new Map();
  private cacheConfig: CacheConfig = Object.freeze({ maxSize: 200, ttlMs: 5 * 60_000 });
  private readonly customFieldMapper?: (field: SchemaField) => z.ZodTypeAny;

  constructor(cacheConfig?: CacheConfig, customFieldMapper?: (field: SchemaField) => z.ZodTypeAny) {
    if (cacheConfig) { this.cacheConfig = Object.freeze({ ...this.cacheConfig, ...cacheConfig }); }
    this.customFieldMapper = customFieldMapper;
  }

  validateData(model: string, data: unknown, schemas: Schemas<TDMMF>): ValidationResult {
    try {
      const zodSchema = this.getOrCreateZodSchema(model as keyof Schemas<TDMMF>, schemas);
      const parsed = zodSchema.parse(data);
      return { success: true, data: parsed };
    } catch (error) {
      return { success: false, error: this.formatError(error) };
    }
  }

  createSchema(model: string, schemas: Schemas<TDMMF>): z.ZodTypeAny {
    return this.getOrCreateZodSchema(model as keyof Schemas<TDMMF>, schemas);
  }

  clearCache(): void { this.schemaCache.clear(); }

  getCacheStats(): Readonly<CacheStats> {
    return Object.freeze({ size: this.schemaCache.size, maxSize: this.cacheConfig.maxSize, ttlMs: this.cacheConfig.ttlMs });
  }

  updateCacheConfig(config: Partial<CacheConfig>): void {
    this.cacheConfig = Object.freeze({ ...this.cacheConfig, ...config });
    this.evictIfNeeded();
  }

  // Private methods
  private getOrCreateZodSchema(model: keyof Schemas<TDMMF>, schemas: Schemas<TDMMF>): z.ZodTypeAny {
    const modelKey = String(model);
    const cached = this.getFromCache(this.schemaCache, modelKey);
    if (cached) { return cached; }
    const schema = this.createZodSchema(model, schemas);
    this.setInCache(this.schemaCache, modelKey, schema);
    return schema;
  }

  private createZodSchema(model: keyof Schemas<TDMMF>, schemas: Schemas<TDMMF>): z.ZodTypeAny {
    const schema = schemas[model];
    if (!schema) { throw new Error(`Model ${String(model)} not found in schemas`); }
    const schemaObject: Record<string, z.ZodTypeAny> = {};
    (Object.keys(schema) as ReadonlyArray<string>).forEach((fieldName) => {
      const field = (schema as Record<string, SchemaField>)[fieldName];
      if (field) {
        schemaObject[fieldName] = this.mapFieldToZod(field);
      }
    });
    return z.object(schemaObject);
  }

  private mapFieldToZod(field: SchemaField): z.ZodTypeAny {
    return this.customFieldMapper ? this.customFieldMapper(field) : defaultFieldMapper(field);
  }

  private formatError(error: unknown): string {
    if (error instanceof z.ZodError) { return error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "); }
    if (error instanceof Error) { return error.message; }
    if (typeof error === "string") { return error; }
    return "Unknown error";
  }

  private getFromCache<T>(cache: Map<string, CacheEntry<T>>, key: string): T | undefined {
    const entry = cache.get(key);
    if (!entry) { return undefined; }
    if (entry.expiresAt && entry.expiresAt < Date.now()) { cache.delete(key); return undefined; }
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
    const toDelete = target.size - maxSize;
    const keys = Array.from(target.keys());
    for (let i = 0; i < toDelete && i < keys.length; i++) { target.delete(keys[i] as string); }
  }
}
