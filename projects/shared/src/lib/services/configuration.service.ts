export interface SharedConfig {
  backend: {
    usersBaseUrl: string;
  };
}

export abstract class ConfigurationService<T extends SharedConfig> {
  abstract getConfig(): T;
}
