import type { CacheConfig } from "../core/types";

export interface PrismateConfig {
  readonly cache?: CacheConfig;
  readonly environment?: "development" | "test" | "production";
}

export function validateConfig(config: unknown): asserts config is PrismateConfig {
  if (typeof config !== "object" || config === null) {
    throw new Error("Invalid PrismateConfig: expected object");
  }
}
