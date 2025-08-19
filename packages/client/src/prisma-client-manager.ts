import { camelCase } from 'change-case';
import { 
  IClientManager, 
  ModelName, 
  Models, 
  ClientConfig, 
  ClientLifecycle 
} from './types';
import { DEFAULT_CLIENT_CONFIG } from './constants';
import { 
  extractModelNames, 
  validateModelName, 
  createSafeOperation,
  formatClientError 
} from './utils';

// Import types from core module
import type { 
  SchemaField, 
  DMMFModel, 
  DMMFField, 
  DMMF, 
  Schemas 
} from '@prismate/core';

/**
 * PrismaClientManager provides a type-safe, memory-safe wrapper around Prisma clients
 * with support for nullable clients and comprehensive schema information.
 */
export class PrismaClientManager<
  TClient extends Record<string, any> | null | undefined,
  TDMMF = unknown
> implements IClientManager<TClient, Schemas<TDMMF>> {
  private readonly client: TClient;
  private readonly config: ClientConfig;
  private readonly lifecycle: ClientLifecycle;
  public readonly models: Models<TClient>;
  public readonly schemas: Schemas<TDMMF>;

  constructor(
    client: TClient, 
    dmmf?: DMMF,
    config: Partial<ClientConfig> = {},
    lifecycle: ClientLifecycle = {}
  ) {
    this.client = client;
    this.config = { ...DEFAULT_CLIENT_CONFIG, ...config };
    this.lifecycle = lifecycle;
    this.models = this.extractModels(client);
    this.schemas = this.buildSchemas(dmmf) as Schemas<TDMMF>;
  }

  /**
   * Extracts model names from the client instance, filtering out internal methods
   */
  private extractModels(client: TClient): Models<TClient> {
    if (!client) return [];

    const modelNames = extractModelNames(client) as ModelName<NonNullable<TClient>>[];
    return Object.freeze([...modelNames]);
  }

  /**
   * Builds schemas from DMMF data, ensuring type safety and immutability
   */
  private buildSchemas(dmmf?: DMMF): Readonly<Record<string, Readonly<Record<string, SchemaField>>>> {
    if (!dmmf?.datamodel?.models) {
      return Object.freeze({});
    }

    const schemas: Record<string, Record<string, SchemaField>> = {};

    for (const model of dmmf.datamodel.models) {
      const camelCaseModelName = camelCase(model.name);
      // Only include models that exist in our client
      if (this.models.includes(camelCaseModelName as ModelName<NonNullable<TClient>>)) {
        schemas[camelCaseModelName] = this.buildModelSchema(model);
      }
    }

    return Object.freeze(schemas);
  }

  /**
   * Builds schema for a single model
   */
  private buildModelSchema(
    model: DMMFModel
  ): Readonly<Record<string, SchemaField>> {
    const modelSchema: Record<string, SchemaField> = {};

    for (const field of model.fields) {
      modelSchema[field.name] = this.createSchemaField(field);
    }

    return Object.freeze(modelSchema);
  }

  /**
   * Creates a schema field from DMMF field data
   */
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
      relationFromFields: field.relationFromFields
        ? Object.freeze([...field.relationFromFields])
        : undefined,
      relationToFields: field.relationToFields
        ? Object.freeze([...field.relationToFields])
        : undefined,
      relationOnDelete: field.relationOnDelete,
      relationOnUpdate: field.relationOnUpdate,
      default: field.default,
      hasDefaultValue: field.hasDefaultValue,
    });
  }

  /**
   * Safely executes a database operation, returning null if client is unavailable
   */
  private async safeExecute<M extends ModelName<NonNullable<TClient>>, R>(
    model: M,
    operation: (client: NonNullable<TClient>, model: M) => Promise<R>
  ): Promise<R | null> {
    if (!this.client) return null;
    
    try {
      return await operation(this.client, model);
    } catch (error) {
      const errorMessage = formatClientError('execute', String(model));
      console.error(errorMessage, error);
      
      if (this.lifecycle.onError) {
        await this.lifecycle.onError(error as Error);
      }
      
      throw error;
    }
  }

  /**
   * Creates a new record in the specified model
   */
  protected async create<M extends ModelName<NonNullable<TClient>>>(
    model: M,
    args: Parameters<NonNullable<TClient>[M]["create"]>[0]
  ): Promise<ReturnType<NonNullable<TClient>[M]["create"]> | null> {
    return this.safeExecute(model, async (client, modelName) => 
      client[modelName].create(args)
    );
  }

  /**
   * Finds a unique record in the specified model
   */
  protected async findUnique<M extends ModelName<NonNullable<TClient>>>(
    model: M,
    args: Parameters<NonNullable<TClient>[M]["findUnique"]>[0]
  ): Promise<ReturnType<NonNullable<TClient>[M]["findUnique"]> | null> {
    return this.safeExecute(model, async (client, modelName) => 
      client[modelName].findUnique(args)
    );
  }

  /**
   * Finds multiple records in the specified model
   */
  protected async findMany<M extends ModelName<NonNullable<TClient>>>(
    model: M,
    args?: Parameters<NonNullable<TClient>[M]["findMany"]>[0]
  ): Promise<ReturnType<NonNullable<TClient>[M]["findMany"]> | []> {
    const result = await this.safeExecute(model, async (client, modelName) => 
      client[modelName].findMany(args)
    );
    return result ?? [];
  }

  /**
   * Updates a record in the specified model
   */
  protected async update<M extends ModelName<NonNullable<TClient>>>(
    model: M,
    args: Parameters<NonNullable<TClient>[M]["update"]>[0]
  ): Promise<ReturnType<NonNullable<TClient>[M]["update"]> | null> {
    return this.safeExecute(model, async (client, modelName) => 
      client[modelName].update(args)
    );
  }

  /**
   * Deletes a record from the specified model
   */
  protected async delete<M extends ModelName<NonNullable<TClient>>>(
    model: M,
    args: Parameters<NonNullable<TClient>[M]["delete"]>[0]
  ): Promise<ReturnType<NonNullable<TClient>[M]["delete"]> | null> {
    return this.safeExecute(model, async (client, modelName) => 
      client[modelName].delete(args)
    );
  }

  /**
   * Checks if the wrapper has an active client
   */
  get hasClient(): boolean {
    return this.client !== null && this.client !== undefined;
  }

  /**
   * Gets the number of available models
   */
  get modelCount(): number {
    return this.models.length;
  }

  /**
   * Gets the number of available schemas
   */
  get schemaCount(): number {
    return Object.keys(this.schemas).length;
  }

  /**
   * Gets the current configuration
   */
  get configuration(): Readonly<ClientConfig> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Validates if a model exists
   */
  hasModel(modelName: string): boolean {
    return validateModelName(this.client, modelName);
  }

  /**
   * Gets schema for a specific model
   */
  getModelSchema(modelName: string): Readonly<Record<string, SchemaField>> | undefined {
    const normalizedName = camelCase(modelName);
    return this.schemas[normalizedName as keyof typeof this.schemas];
  }
}