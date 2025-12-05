import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMockApiService } from './base-mock-api.service';
import { AlertRepositoryService } from '../alert-repository.service';
import { AlertResponseDto } from '@shared/models/alert/query/alert-response.model';
import { AlertRequestDto } from '@shared/models/alert/command/alert-request.model';
import { AqlParser } from './parsers/aql-parser';

@Injectable({
  providedIn: 'root',
})
export class AlertRepositoryMockService
  extends BaseMockApiService
  implements AlertRepositoryService
{
  private alerts: AlertResponseDto[] = [
    {
      id: '9052f6f2-91d3-4b04-a3c8-e46f845c6c09',
      name: 'DNIe entre los años 2000 y 2002 con Lugar de Nacimiento León',
      lastModifiedBy: 'Jane Doe',
      lastModifiedAt: new Date('2025-12-03T09:52:55.010542'),
      filtersAQL:
        "FechaExpedicion >= 2000-01-01 Y FechaExpedicion < 1970-01-01 Y LugarNacimiento Contiene 'León'",
      active: true,
    },
    {
      id: 'eb03ced1-8563-422b-971f-70bd920dee56',
      name: 'Pasaportes Expedidos en Kazakhstan en las oficinas 01234 y 56780',
      lastModifiedBy: 'John Doe',
      lastModifiedAt: new Date('2025-12-03T09:52:55.010428'),
      filtersAQL:
        "(OficinaExpedidora = '01234' O OficinaExpedidora = '56780') Y Nacionalidad = 'KAZ'",
      active: true,
    },
  ];

  // -------------------------------
  // ALERTS
  // -------------------------------

  getAll(): Observable<AlertResponseDto[]> {
    return this.handleUnauthorized(() => this.ok(this.alerts));
  }

  getById(id: string): Observable<AlertResponseDto> {
    return this.handleUnauthorized(() => {
      const user = this.alerts.find((u) => u.id === id);
      return user ? this.ok(user) : this.notFound();
    });
  }

  create(alert: AlertRequestDto): Observable<AlertResponseDto> {
    return this.handleUnauthorized(() => {
      // Name required (mirrors backend validator)
      if (!alert.name || !alert.name.trim()) {
        return this.badRequest(['Name is required.']);
      }

      // AQL validation: use parser.tryParse
      const parsed = AqlParser.tryParse(alert.filtersAQL ?? '');
      if (!parsed.success) {
        return this.badRequest([`FiltersAQL syntax invalid: ${parsed.error}`]);
      }

      const newAlert: AlertResponseDto = {
        ...alert,
        id: crypto.randomUUID(),
        lastModifiedAt: new Date(),
        lastModifiedBy: 'mock-user',
      };
      this.alerts.push(newAlert);
      return this.created(newAlert);
    });
  }

  update(id: string, alert: AlertRequestDto): Observable<AlertResponseDto> {
    return this.handleUnauthorized(() => {
      const existing = this.alerts.find((u) => u.id === id);
      if (!existing) return this.notFound();

      // Name required (mirrors backend validator)
      if (!alert.name || !alert.name.trim()) {
        return this.badRequest(['Name is required.']);
      }

      // AQL validation: use parser.tryParse
      const parsed = AqlParser.tryParse(alert.filtersAQL ?? '');
      if (!parsed.success) {
        return this.badRequest([`FiltersAQL syntax invalid: ${parsed.error}`]);
      }

      // Update only editable fields
      existing.name = alert.name ?? existing.name;
      existing.filtersAQL = alert.filtersAQL ?? existing.filtersAQL;
      existing.active = alert.active ?? existing.active;
      existing.lastModifiedAt = new Date();
      existing.lastModifiedBy = 'mock-user';

      return this.ok(existing);
    });
  }

  delete(id: string): Observable<void> {
    return this.handleUnauthorized(() => {
      const index = this.alerts.findIndex((a) => a.id === id);
      if (index === -1) return this.notFound();
      this.alerts.splice(index, 1);
      return this.ok();
    });
  }
}
