import { SharedConfig } from '@shared/services/configuration.service';

export interface IConfig extends SharedConfig {
  services?: {
    auth?: string;
    user?: string;
    case?: string;
    auxiliar?: string;
    alert?: string;
    documentScanner?: string;
  };
}
