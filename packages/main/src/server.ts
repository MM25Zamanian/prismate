import { ModelName, PrismaClientManager, SchemaField, Schemas } from "./prisma-client-manager";
import { z } from "zod";

// Type definitions for better type safety
type CreateInput = {
  model: string;
  data: any;
};

type FindManyInput = {
  model: string;
  where?: any;
  select?: any;
  include?: any;
  orderBy?: any;
  take?: number;
  skip?: number;
};

type FindUniqueInput = {
  model: string;
  where: any;
  select?: any;
  include?: any;
};

type UpdateInput = {
  model: string;
  where: any;
  data: any;
  select?: any;
  include?: any;
};

type DeleteInput = {
  model: string;
  where: any;
  select?: any;
  include?: any;
};

type CountInput = {
  model: string;
  where?: any;
};

type AggregateInput = {
  model: string;
  where?: any;
  _count?: any;
  _avg?: any;
  _sum?: any;
  _min?: any;
  _max?: any;
};

// Cache for Zod schemas to improve performance
type SchemaCache = Map<string, z.ZodTypeAny>;

export default class Server<
  TClient extends Record<string, any> | null | undefined,
  TDMMF = unknown,
> extends PrismaClientManager<TClient, TDMMF> {
  private readonly schemaCache: SchemaCache = new Map();

  constructor(client: TClient, dmmf?: any) {
    super(client, dmmf);
  }
  // Handler methods for better separation of concerns
  private async handleCreate(input: CreateInput) {
    try {
      const validatedData = this.validateData(input.model, input.data);
      return await this.create(input.model as ModelName<NonNullable<TClient>>, {
        data: validatedData,
      });
    } catch (error) {
      throw new Error(`Create operation failed: ${this.formatError(error)}`);
    }
  }

  private async handleFindMany(input: FindManyInput) {
    try {
      return await this.findMany(
        input.model as ModelName<NonNullable<TClient>>,
        {
          where: input.where,
          select: input.select,
          include: input.include,
          orderBy: input.orderBy,
          take: input.take,
          skip: input.skip,
        }
      );
    } catch (error) {
      throw new Error(`FindMany operation failed: ${this.formatError(error)}`);
    }
  }

  private async handleFindUnique(input: FindUniqueInput) {
    try {
      return await this.findUnique(
        input.model as ModelName<NonNullable<TClient>>,
        {
          where: input.where,
          select: input.select,
          include: input.include,
        }
      );
    } catch (error) {
      throw new Error(
        `FindUnique operation failed: ${this.formatError(error)}`
      );
    }
  }

  private async handleUpdate(input: UpdateInput) {
    try {
      const validatedData = this.validateData(input.model, input.data);
      return await this.update(input.model as ModelName<NonNullable<TClient>>, {
        where: input.where,
        data: validatedData,
        select: input.select,
        include: input.include,
      });
    } catch (error) {
      throw new Error(`Update operation failed: ${this.formatError(error)}`);
    }
  }

  private async handleDelete(input: DeleteInput) {
    try {
      return await this.delete(input.model as ModelName<NonNullable<TClient>>, {
        where: input.where,
        select: input.select,
        include: input.include,
      });
    } catch (error) {
      throw new Error(`Delete operation failed: ${this.formatError(error)}`);
    }
  }

  private async handleCount(input: CountInput) {
    try {
      if (!this.hasClient) {
        throw new Error("No database client available");
      }

      // For count operations, we'll need to implement a custom method
      // For now, return null as this method doesn't exist in PrismaWrapper
      return null;
    } catch (error) {
      throw new Error(`Count operation failed: ${this.formatError(error)}`);
    }
  }

  private async handleAggregate(input: AggregateInput) {
    try {
      if (!this.hasClient) {
        throw new Error("No database client available");
      }

      // For aggregate operations, we'll need to implement a custom method
      // For now, return null as this method doesn't exist in PrismaWrapper
      return null;
    } catch (error) {
      throw new Error(`Aggregate operation failed: ${this.formatError(error)}`);
    }
  }

  /**
   * Validates input data against the model's schema
   */
  private validateData(model: string, data: any): any {
    try {
      const zodSchema = this.getOrCreateZodSchema(
        model as keyof Schemas<TDMMF>
      );
      return zodSchema.parse(data);
    } catch (error) {
      throw new Error(
        `Validation failed for model ${model}: ${this.formatError(error)}`
      );
    }
  }

  /**
   * Gets or creates a Zod schema for a specific model (with caching)
   */
  private getOrCreateZodSchema(model: keyof Schemas<TDMMF>): z.ZodTypeAny {
    const modelKey = String(model);

    // Check cache first for better performance
    if (this.schemaCache.has(modelKey)) {
      return this.schemaCache.get(modelKey)!;
    }

    // Create new schema if not cached
    const schema = this.createZodSchema(model);
    this.schemaCache.set(modelKey, schema);

    return schema;
  }

  /**
   * Creates a Zod schema for a specific model
   */
  private createZodSchema(model: keyof Schemas<TDMMF>): z.ZodTypeAny {
    if (!this.schemas[model]) {
      throw new Error(`Model ${String(model)} not found in schemas`);
    }

    const schema = this.schemas[model];
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    // Iterate over the schema object keys for better performance
    Object.keys(schema).forEach((fieldName) => {
      const field = schema[fieldName as keyof typeof schema];
      schemaObject[fieldName] = this.mapFieldToZod(field);
    });

    return z.object(schemaObject);
  }

  /**
   * Maps a Prisma field to its corresponding Zod schema
   */
  private mapFieldToZod(field: SchemaField): z.ZodTypeAny {
    let zodSchema: z.ZodTypeAny;

    // Handle relation fields to prevent serialization issues
    if (field.kind === "object" && field.relationName) {
      zodSchema = z
        .object({
          id: z.string().optional(),
        })
        .optional();
    } else {
      zodSchema = this.getBaseZodType(field.type);
    }

    // Handle list fields
    if (field.isList) {
      zodSchema = z.array(zodSchema);
    }

    // Handle optional and nullable fields
    if (!field.isRequired) {
      if (field.isList) {
        zodSchema = zodSchema.optional();
      } else {
        zodSchema = zodSchema.nullable().optional();
      }
    }

    return zodSchema;
  }

  /**
   * Gets the base Zod type for a Prisma field type
   */
  private getBaseZodType(fieldType: string): z.ZodTypeAny {
    switch (fieldType) {
      case "String":
        return z.string();
      case "Int":
        return z.number().int();
      case "Float":
        return z.number();
      case "BigInt":
        return z.bigint();
      case "DateTime":
        return z.coerce.date();
      case "Boolean":
        return z.boolean();
      case "Json":
        return z.any();
      case "Bytes":
        return z.instanceof(Uint8Array).or(z.string());
      case "Decimal":
        return z.number();
      default:
        // Handle enum types and other complex types
        if (fieldType.includes("Enum")) {
          return z.string(); // Treat enums as strings for now
        }
        return z.unknown();
    }
  }

  /**
   * Formats error messages consistently
   */
  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "Unknown error occurred";
  }

  /**
   * Clears the schema cache to free memory
   */
  clearSchemaCache(): void {
    this.schemaCache.clear();
  }

  /**
   * Gets cache statistics for monitoring
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.schemaCache.size,
      hitRate: 0, // Could implement hit rate tracking if needed
    };
  }

  // Public helper methods for external use
  /**
   * Gets all available model names
   */
  getAvailableModels(): readonly string[] {
    return Object.freeze([...Object.keys(this.schemas)]);
  }

  /**
   * Gets schema information for a specific model
   */
  getModelSchema(model: string): readonly SchemaField[] | undefined {
    const schema = this.schemas[model as keyof Schemas<TDMMF>];
    if (!schema) return undefined;

    // Return immutable array of schema fields
    return Object.freeze(
      Object.keys(schema).map((key) => schema[key as keyof typeof schema])
    );
  }

  /**
   * Checks if a model exists in the schema
   */
  hasModel(model: string): boolean {
    return model in this.schemas;
  }

  /**
   * Gets all field names for a specific model
   */
  getModelFields(model: string): readonly string[] {
    const schema = this.schemas[model as keyof Schemas<TDMMF>];
    return Object.freeze(schema ? Object.keys(schema) : []);
  }

  /**
   * Gets the total number of available models
   */
  get modelCount(): number {
    return Object.keys(this.schemas).length;
  }

  /**
   * Gets the total number of available schemas
   */
  get schemaCount(): number {
    return Object.keys(this.schemas).length;
  }

  /**
   * Cleanup method for proper resource management
   */
  dispose(): void {
    this.clearSchemaCache();
  }
}
