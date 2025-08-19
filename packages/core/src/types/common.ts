// Common utility types and interfaces

// Generic result type for operations
export type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

// Async result type
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// Pagination types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Sorting types
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: string;
  order: SortOrder;
}

// Filter types
export interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';
  value: unknown;
}

export interface FilterGroup {
  operator: 'AND' | 'OR' | 'NOT';
  conditions: (FilterCondition | FilterGroup)[];
}

// Query options
export interface QueryOptions {
  select?: Record<string, boolean>;
  include?: Record<string, boolean>;
  where?: Record<string, unknown>;
  orderBy?: SortOption | SortOption[];
  pagination?: PaginationOptions;
}

// Cache types
export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
}

export interface CacheStats {
  size: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
}

// Lifecycle types
export interface Lifecycle {
  initialize(): Promise<void>;
  dispose(): Promise<void>;
  isInitialized(): boolean;
}

// Configurable interface
export interface Configurable<TConfig> {
  configure(config: Partial<TConfig>): void;  
  getConfig(): TConfig;
} 