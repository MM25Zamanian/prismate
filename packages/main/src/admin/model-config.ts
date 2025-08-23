export type FieldMapping = {
  readonly alias?: string;
  readonly hidden?: boolean;
  readonly readonly?: boolean;
};

export type ModelConfig = {
  readonly fieldMappings?: Readonly<Record<string, FieldMapping>>;
};

export class ModelConfigurationManager {
  private readonly modelToConfig = new Map<string, ModelConfig>();

  setConfig(model: string, config: ModelConfig): void {
    this.modelToConfig.set(model, { ...(this.modelToConfig.get(model) ?? {}), ...config });
  }

  getConfig(model: string): ModelConfig | undefined { return this.modelToConfig.get(model); }

  setFieldMapping(model: string, field: string, mapping: FieldMapping): void {
    const prev = this.modelToConfig.get(model)?.fieldMappings ?? {};
    const next: ModelConfig = { fieldMappings: { ...prev, [field]: { ...(prev[field] ?? {}), ...mapping } } };
    this.setConfig(model, next);
  }
}
