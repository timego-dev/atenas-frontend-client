import { AuthConfig } from 'angular-oauth2-oidc';

export interface SharedConfig {
  backend: {
    url: string;
  };
  clientService: {
    url: string;
  };
  auth: AuthConfig;
}

export abstract class ConfigurationService<T extends SharedConfig> {
  abstract getConfig(): T;
}
