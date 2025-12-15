import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { SystemConfigurationDto } from '@shared/models/system-configuration/system-configuration.dto';

export abstract class SystemConfigurationRepositoryService {
  /** GET /system-configuration */
  abstract get(): Observable<SystemConfigurationDto>;

  /** PUT /system-configuration */
  abstract update(config: SystemConfigurationDto): Observable<SystemConfigurationDto>;
}

export class SystemConfigurationRepositoryRemoteService
  implements SystemConfigurationRepositoryService
{
  private readonly configurationService = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = this.configurationService.getConfig().backend?.url + '/system-configuration';
  }

  /** GET /system-configuration */
  get(): Observable<SystemConfigurationDto> {
    return this.http.get<SystemConfigurationDto>(this.baseUrl);
  }

  /** PUT /system-configuration */
  update(config: SystemConfigurationDto): Observable<SystemConfigurationDto> {
    return this.http.put<SystemConfigurationDto>(this.baseUrl, config);
  }
}
