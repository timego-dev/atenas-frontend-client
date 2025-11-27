export interface SharedConfig {
  backend: {
    url: string;
  };
  clientService: {
    url: string;
  };
}

export abstract class ConfigurationService<T extends SharedConfig> {
  abstract getConfig(): T;
}
