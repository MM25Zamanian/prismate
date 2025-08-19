import type { SchemaField } from '@prismate/core';

// Base operation interface
export interface IOperation<TInput = any, TOutput = any> {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: any;
  readonly outputSchema: any;
  
  execute(input: TInput): Promise<TOutput>;
  validate(input: TInput): boolean;
}

// CRUD operation types
export interface CreateOperation<TData = any, TResult = any> extends IOperation<CreateInput<TData>, TResult> {
  readonly type: 'create';
}

export interface ReadOperation<TWhere = any, TResult = any> extends IOperation<ReadInput<TWhere>, TResult> {
  readonly type: 'read';
}

export interface UpdateOperation<TWhere = any, TData = any, TResult = any> extends IOperation<UpdateInput<TWhere, TData>, TResult> {
  readonly type: 'update';
}

export interface DeleteOperation<TWhere = any, TResult = any> extends IOperation<DeleteInput<TWhere>, TResult> {
  readonly type: 'delete';
}

// Operation input types
export interface CreateInput<TData = any> {
  readonly data: TData;
  readonly select?: Record<string, any>;
  readonly include?: Record<string, any>;
}

export interface ReadInput<TWhere = any> {
  readonly where?: TWhere;
  readonly select?: Record<string, any>;
  readonly include?: Record<string, any>;
  readonly orderBy?: Record<string, any> | Record<string, any>[];
  readonly take?: number;
  readonly skip?: number;
  readonly cursor?: Record<string, any>;
}

export interface UpdateInput<TWhere = any, TData = any> {
  readonly where: TWhere;
  readonly data: TData;
  readonly select?: Record<string, any>;
  readonly include?: Record<string, any>;
}

export interface DeleteInput<TWhere = any> {
  readonly where: TWhere;
  readonly select?: Record<string, any>;
  readonly include?: Record<string, any>;
}

// Query operation types
export interface QueryOperation<TInput = any, TResult = any> extends IOperation<TInput, TResult> {
  readonly type: 'query';
  readonly queryType: 'findMany' | 'findUnique' | 'findFirst' | 'count' | 'aggregate';
}

// Batch operation types
export interface BatchOperation<TInput = any, TResult = any> extends IOperation<TInput, TResult> {
  readonly type: 'batch';
  readonly operations: IOperation[];
  readonly strategy: 'sequential' | 'parallel' | 'transaction';
}

// Operation result types
export interface OperationResult<T = any> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: Error;
  readonly metadata?: OperationMetadata;
}

export interface OperationMetadata {
  readonly executionTime: number;
  readonly operationCount: number;
  readonly cacheHit?: boolean;
  readonly validationPassed: boolean;
}

// Operation options
export interface OperationOptions {
  readonly timeout?: number;
  readonly retries?: number;
  readonly retryDelay?: number;
  readonly validateInput?: boolean;
  readonly cacheResult?: boolean;
  readonly logOperation?: boolean;
}

// Operation context
export interface OperationContext {
  readonly model: string;
  readonly operation: string;
  readonly timestamp: Date;
  readonly userId?: string;
  readonly sessionId?: string;
  readonly requestId?: string;
  readonly metadata?: Record<string, any>;
}

// Operation pipeline
export interface OperationPipeline<TInput = any, TOutput = any> {
  readonly stages: OperationStage<TInput, TOutput>[];
  readonly options: PipelineOptions;
  
  execute(input: TInput): Promise<TOutput>;
  addStage(stage: OperationStage<TInput, TOutput>): this;
  removeStage(stageName: string): this;
}

// Operation stage
export interface OperationStage<TInput = any, TOutput = any> {
  readonly name: string;
  readonly execute: (input: TInput, context: OperationContext) => Promise<TInput | TOutput>;
  readonly validate?: (input: TInput) => boolean;
  readonly rollback?: (input: TInput, context: OperationContext) => Promise<void>;
}

// Pipeline options
export interface PipelineOptions {
  readonly continueOnError?: boolean;
  readonly rollbackOnError?: boolean;
  readonly timeout?: number;
  readonly maxRetries?: number;
}

// Operation factory
export interface OperationFactory {
  createCreateOperation<TData, TResult>(
    model: string,
    options?: OperationOptions
  ): CreateOperation<TData, TResult>;
  
  createReadOperation<TWhere, TResult>(
    model: string,
    options?: OperationOptions
  ): ReadOperation<TWhere, TResult>;
  
  createUpdateOperation<TWhere, TData, TResult>(
    model: string,
    options?: OperationOptions
  ): UpdateOperation<TWhere, TData, TResult>;
  
  createDeleteOperation<TWhere, TResult>(
    model: string,
    options?: OperationOptions
  ): DeleteOperation<TWhere, TResult>;
  
  createQueryOperation<TInput, TResult>(
    model: string,
    queryType: string,
    options?: OperationOptions
  ): QueryOperation<TInput, TResult>;
  
  createBatchOperation<TInput, TResult>(
    operations: IOperation[],
    strategy: string,
    options?: OperationOptions
  ): BatchOperation<TInput, TResult>;
}