import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMockApiService } from './base-mock-api.service';
import { SystemConfigurationRepositoryService } from '../system-configuration-repository.service';
import { SystemConfigurationDto } from '@shared/models/system-configuration/system-configuration.dto';

@Injectable({
  providedIn: 'root',
})
export class SystemConfigurationRepositoryMockService
  extends BaseMockApiService
  implements SystemConfigurationRepositoryService
{
  // In-memory singleton record
  private config: SystemConfigurationDto = {
    purgeDaysWithoutCounterfeitCases: 30,
    purgeDailyExecutionTime: '20:00',
    counterfeitNotificationEmails: '',
    maxCaseSearchOccurrences: 2000,
    maxPendingTimeMinutes: 3,
  };

  /** GET /system-configuration */
  get(): Observable<SystemConfigurationDto> {
    return this.handleUnauthorized(() => this.ok({ ...this.config }));
  }

  /** PUT /system-configuration */
  update(config: SystemConfigurationDto): Observable<SystemConfigurationDto> {
    return this.handleUnauthorized(() => {
      // Update only the fields we expect (merge)
      this.config = { ...this.config, ...config };
      return this.ok({ ...this.config });
    });
  }
}
