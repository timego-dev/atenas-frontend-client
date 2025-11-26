export interface SharedConfig {
  backend: string;
  clientService: string;
}

export abstract class ConfigurationService<T extends SharedConfig> {
  abstract getConfig(): T;
}
