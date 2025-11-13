export abstract class ConfigurationService {
  abstract getValue(key: string, defaultValue?: any): any;
}
