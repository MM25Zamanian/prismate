import type { PrismateConfig } from "./prismate-config";

export const defaultConfig: Readonly<PrismateConfig> = Object.freeze({
  environment: "development",
  cache: { maxSize: 200, ttlMs: 5 * 60_000 },
});
