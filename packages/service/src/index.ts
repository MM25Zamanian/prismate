import { PrismateCore } from "@prismate/core";
import {
  PrismateDatabase,
  type QueryOptions,
  type ModelDelegate,
} from "@prismate/database";
import { PrismateValidator, type ValidationResult } from "@prismate/validation";

import type { Schemas, SchemaField } from "@prismate/core";

export class PrismateService<
  TClient extends Record<string, ModelDelegate> | null | undefined,
  TDMMF,
> {
  private readonly core: PrismateCore<TClient, TDMMF>;
  private readonly validator: PrismateValidator<TDMMF>;
  private readonly database: PrismateDatabase<TClient>;

  constructor(client: TClient, dmmf?: import("@prismate/core").DMMF) {
    this.core = new PrismateCore<TClient, TDMMF>(client, dmmf);
    this.validator = new PrismateValidator<TDMMF>();
    this.database = new PrismateDatabase<TClient>(client);
  }

  // Public API
  async createModel(model: string, data: unknown): Promise<unknown> {
    const validation: ValidationResult = this.validator.validateData(
      model,
      data,
      this.core.schemas as unknown as Schemas<TDMMF>
    );
    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.error}`);
    }
    return this.database.create(model, validation.data as unknown);
  }

  async getModels(model: string, options?: QueryOptions): Promise<unknown[]> {
    return this.database.findMany(model, options);
  }

  async updateModel(
    model: string,
    id: string | number,
    data: unknown
  ): Promise<unknown> {
    const validation: ValidationResult = this.validator.validateData(
      model,
      data,
      this.core.schemas as unknown as Schemas<TDMMF>
    );
    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.error}`);
    }
    return this.database.update(model, { id }, validation.data as unknown);
  }

  async deleteModel(model: string, id: string | number): Promise<unknown> {
    return this.database.delete(model, { id });
  }

  // Schema info
  getAvailableModels(): string[] {
    return [...this.core.getAvailableModels()];
  }
  getModelSchema(model: string): SchemaField[] {
    return [...this.core.getModelSchema(model)];
  }
  getModelFields(model: string): string[] {
    return [
      ...Object.keys(
        (
          this.core.schemas as unknown as Record<
            string,
            Record<string, SchemaField>
          >
        )[model] ?? {}
      ),
    ];
  }

  // Lifecycle
  dispose(): void {
    this.core.dispose();
    this.database.dispose();
  }
}
