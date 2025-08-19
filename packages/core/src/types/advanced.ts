// Advanced type patterns and utility types

// Enhanced Result type with better constraints
export type Result<T, E extends Error = Error> = 
  | { success: true; data: T; error?: never; }
  | { success: false; data?: never; error: E; };

// Utility types for Result
export type SuccessResult<T> = Extract<Result<T>, { success: true }>;
export type ErrorResult<E> = Extract<Result<T>, { success: false }>;

// Async Result type
export type AsyncResult<T, E extends Error = Error> = Promise<Result<T, E>>;

// Deep partial type for nested objects
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep required type for nested objects
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Deep readonly type for nested objects
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Mutable type utility
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// NonNullable for nested objects
export type DeepNonNullable<T> = {
  [P in keyof T]: T[P] extends object ? DeepNonNullable<T[P]> : NonNullable<T[P];
};

// Union to intersection type
export type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Tuple to union type
export type TupleToUnion<T extends readonly any[]> = T[number];

// Array element type
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Function return type
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Function parameters type
export type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Constructor type
export type Constructor<T> = new (...args: any[]) => T;

// Instance type
export type InstanceType<T> = T extends Constructor<infer U> ? U : never;

// Branded types for type safety
export type Brand<K, T> = K & { __brand: T };

// Nominal types
export type Nominal<T, K> = T & { __nominal: K };

// Tagged types
export type Tagged<T, K> = T & { __tag: K };

// Conditional types
export type If<C extends boolean, T, F> = C extends true ? T : F;

// IsNever type utility
export type IsNever<T> = [T] extends [never] ? true : false;

// IsAny type utility
export type IsAny<T> = 0 extends (1 & T) ? true : false;

// IsUnknown type utility
export type IsUnknown<T> = IsNever<T> extends true ? false : IsAny<T> extends true ? false : unknown extends T ? true : false;

// IsLiteral type utility
export type IsLiteral<T> = [T] extends [never] ? false : [T] extends [unknown] ? false : true;

// Extract literal types
export type ExtractLiteral<T> = T extends string | number | boolean ? T : never;

// Exclude literal types
export type ExcludeLiteral<T> = T extends string | number | boolean ? never : T;

// Path type for nested object access
export type Path<T> = T extends string | number | boolean
  ? []
  : T extends readonly any[]
  ? [number, ...Path<T[number]>]
  : T extends object
  ? {
      [K in keyof T]: [K, ...Path<T[K]>];
    }[keyof T]
  : [];

// PathValue type for getting nested values
export type PathValue<T, P extends Path<T>> = P extends [infer K, ...infer R]
  ? K extends keyof T
    ? R extends Path<T[K]>
      ? PathValue<T[K], R>
      : never
    : never
  : T;

// Type-safe event emitter
export type EventMap = Record<string, any>;
export type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;

export interface TypedEventEmitter<T extends EventMap> {
  on<K extends EventKey<T>>(event: K, fn: EventReceiver<T[K]>): this;
  off<K extends EventKey<T>>(event: K, fn: EventReceiver<T[K]>): this;
  emit<K extends EventKey<T>>(event: K, params: T[K]): boolean;
}

// Type-safe builder pattern
export type Builder<T, K extends keyof T = keyof T> = {
  [P in K]: (value: T[P]) => Builder<Omit<T, P>, Exclude<K, P>>;
} & {
  build(): T;
};

// Type-safe state machine
export type StateMachine<TState extends string, TEvent extends string> = {
  currentState: TState;
  transitions: Record<TState, Record<TEvent, TState>>;
  transition(event: TEvent): TState;
};

// Type-safe option builder
export type OptionBuilder<T> = {
  [K in keyof T]: (value: T[K]) => OptionBuilder<Omit<T, K>>;
} & {
  build(): T;
};

// Type-safe validation result
export type ValidationResult<T> = 
  | { valid: true; value: T; errors?: never; }
  | { valid: false; value?: never; errors: string[]; };

// Type-safe async validation result
export type AsyncValidationResult<T> = Promise<ValidationResult<T>>;

// Type-safe retry configuration
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoff: 'linear' | 'exponential' | 'fibonacci';
  jitter: boolean;
  timeout: number;
}

// Type-safe cache configuration
export interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'lfu' | 'fifo';
  compression: boolean;
  serialization: 'json' | 'binary' | 'custom';
}

// Type-safe performance metrics
export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  cacheHits: number;
  cacheMisses: number;
  errorCount: number;
  successCount: number;
}