// Prisma client types and interfaces

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

// Prisma client wrapper interface
export interface PrismaClientWrapper<TClient> {
  readonly client: TClient;
  readonly hasClient: boolean;
  readonly models: Models<TClient>;
  readonly modelCount: number;
} 