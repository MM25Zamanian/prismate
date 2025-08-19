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

// Type-safe models array
export type Models<TClient> = readonly ModelName<NonNullable<TClient>>[];

// Client manager interface
export interface IClientManager<TClient, TDMMF> {
  readonly models: Models<TClient>;
  readonly schemas: TDMMF;
  readonly hasClient: boolean;
  readonly modelCount: number;
  readonly schemaCount: number;
}

// Client configuration options
export interface ClientConfig {
  readonly enableLogging?: boolean;
  readonly enableMetrics?: boolean;
  readonly connectionTimeout?: number;
  readonly queryTimeout?: number;
}

// Client lifecycle events
export interface ClientLifecycle {
  readonly onConnect?: () => void | Promise<void>;
  readonly onDisconnect?: () => void | Promise<void>;
  readonly onError?: (error: Error) => void | Promise<void>;
}