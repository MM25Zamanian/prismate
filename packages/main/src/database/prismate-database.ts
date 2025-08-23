import type { ModelName } from "../core/types";

export type QueryOptions = {
  readonly where?: unknown;
  readonly select?: unknown;
  readonly include?: unknown;
  readonly orderBy?: unknown;
  readonly take?: number;
  readonly skip?: number;
};

export type AggregateOptions = {
  readonly where?: unknown;
  readonly _count?: unknown;
  readonly _avg?: unknown;
  readonly _sum?: unknown;
  readonly _min?: unknown;
  readonly _max?: unknown;
};

export type ModelDelegate = {
  readonly create?: (args: unknown) => Promise<unknown>;
  readonly findMany?: (args?: unknown) => Promise<unknown[]>;
  readonly findUnique?: (args: unknown) => Promise<unknown | null>;
  readonly update?: (args: unknown) => Promise<unknown>;
  readonly delete?: (args: unknown) => Promise<unknown>;
  readonly count?: (args?: unknown) => Promise<number>;
  readonly aggregate?: (args: unknown) => Promise<unknown>;
};

export class PrismateDatabase<TClient extends Record<string, ModelDelegate> | null | undefined> {
  private readonly client: TClient;

  constructor(client: TClient) {
    this.client = client;
  }

  async create<T>(model: string, data: T): Promise<unknown> {
    if (!this.client) { throw new Error("Database client is not available"); }
    const m = model as ModelName<NonNullable<TClient>>;
    const delegate = (this.client as NonNullable<TClient>)[m];
    if (!delegate?.create) { throw new Error(`Model '${model}' does not support create`); }
    return delegate.create({ data } as unknown);
  }

  async findMany<T>(model: string, options?: QueryOptions): Promise<T[]> {
    if (!this.client) { return []; }
    const m = model as ModelName<NonNullable<TClient>>;
    const delegate = (this.client as NonNullable<TClient>)[m];
    if (!delegate?.findMany) { return []; }
    return delegate.findMany(options as unknown) as Promise<T[]>;
  }

  async findUnique<T>(model: string, where: unknown): Promise<T | null> {
    if (!this.client) { return null; }
    const m = model as ModelName<NonNullable<TClient>>;
    const delegate = (this.client as NonNullable<TClient>)[m];
    if (!delegate?.findUnique) { return null; }
    return delegate.findUnique({ where } as unknown) as Promise<T | null>;
  }

  async update<T>(model: string, where: unknown, data: T): Promise<unknown> {
    if (!this.client) { throw new Error("Database client is not available"); }
    const m = model as ModelName<NonNullable<TClient>>;
    const delegate = (this.client as NonNullable<TClient>)[m];
    if (!delegate?.update) { throw new Error(`Model '${model}' does not support update`); }
    return delegate.update({ where, data } as unknown);
  }

  async delete(model: string, where: unknown): Promise<unknown> {
    if (!this.client) { throw new Error("Database client is not available"); }
    const m = model as ModelName<NonNullable<TClient>>;
    const delegate = (this.client as NonNullable<TClient>)[m];
    if (!delegate?.delete) { throw new Error(`Model '${model}' does not support delete`); }
    return delegate.delete({ where } as unknown);
  }

  async count(model: string, where?: unknown): Promise<number> {
    if (!this.client) { return 0; }
    const m = model as ModelName<NonNullable<TClient>>;
    const delegate = (this.client as NonNullable<TClient>)[m];
    if (!delegate?.count) { return 0; }
    return delegate.count({ where } as unknown) as Promise<number>;
  }

  async aggregate(model: string, options: AggregateOptions): Promise<unknown> {
    if (!this.client) { return null; }
    const m = model as ModelName<NonNullable<TClient>>;
    const delegate = (this.client as NonNullable<TClient>)[m];
    if (!delegate?.aggregate) { return null; }
    return delegate.aggregate(options as unknown);
  }

  getClient(): TClient { return this.client; }
  hasClient(): boolean { return this.client !== null && this.client !== undefined; }
  dispose(): void { /* no-op; hook for future resource cleanup */ }
}
