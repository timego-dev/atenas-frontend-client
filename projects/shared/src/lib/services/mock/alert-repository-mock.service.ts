import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMockApiService } from './base-mock-api.service';
import { AlertRequestDto } from '@shared/models/alert/command/alert-request.model';
import {
  AlertCodeListDto,
  AlertFieldNameDto,
  AlertFieldType,
  AlertResponseDto,
} from '@shared/models/alert/query/alert-response.model';
import { AqlParser } from './parsers/aql-parser';
import { AlertRepositoryService } from '../alert-repository.service';

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
      nCases: 33,
      nCounterfeits: 5,
      filtersAQL:
        "FechaExpedicion >= '2000-01-01' Y FechaExpedicion < '1970-01-01' Y LugarNacimiento Contiene 'León'",
      active: true,
    },
    {
      id: 'eb03ced1-8563-422b-971f-70bd920dee56',
      name: 'Pasaportes Expedidos en Kazakhstan en las oficinas 01234 y 56780',
      lastModifiedBy: 'John Doe',
      lastModifiedAt: new Date('2025-12-03T09:52:55.010428'),
      nCases: 18,
      nCounterfeits: 12,
      filtersAQL:
        "(OficinaExpedidora = '01234' O OficinaExpedidora = '56780') Y Nacionalidad = 'KAZ'",
      active: true,
    },
  ];

  private fieldNames: AlertFieldNameDto[] = [
    { fieldName: 'Nacionalidad', displayName: 'Nacionalidad', type: AlertFieldType.CountryList },
    { fieldName: 'PaisExpedidor', displayName: 'País expedidor', type: AlertFieldType.CountryList },
    { fieldName: 'FechaExpedicion', displayName: 'Fecha de expedición', type: AlertFieldType.Date },
    { fieldName: 'NumeroDocumento', displayName: 'Número de documento' },
    { fieldName: 'Nombre', displayName: 'Nombre' },
    { fieldName: 'Apellidos', displayName: 'Apellidos' },
    { fieldName: 'FechaNacimiento', displayName: 'Fecha de nacimiento', type: AlertFieldType.Date },
    {
      fieldName: 'TipoDocumento',
      displayName: 'Tipo de documento',
      type: AlertFieldType.DocTypeList,
    },
    { fieldName: 'FechaCaducidad', displayName: 'Fecha de caducidad', type: AlertFieldType.Date },
    { fieldName: 'Sexo', displayName: 'Sexo', type: AlertFieldType.SexList },
    { fieldName: 'LugarNacimiento', displayName: 'Lugar de nacimiento' },
    { fieldName: 'OficinaExpedidora', displayName: 'Oficina expedidora' },
  ];

  private countries: AlertCodeListDto[] = [
    { code: 'ESP', name: 'Spain' },
    { code: 'FRA', name: 'France' },
    { code: 'KAZ', name: 'Kazakhstan' },
    { code: 'USA', name: 'United States' },
    { code: 'CAN', name: 'Canada' },
  ];

  private docTypes: AlertCodeListDto[] = [
    { code: 'DNI', name: 'DNI' },
    { code: 'PAS', name: 'Passport' },
    { code: 'NIE', name: 'NIE' },
    { code: 'DRIVING', name: 'Driving License' },
  ];

  private sexes: AlertCodeListDto[] = [
    { code: 'M', name: 'Male' },
    { code: 'F', name: 'Female' },
    { code: 'X', name: 'Unspecified / Non-binary / Other' },
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

      // Generate nCases: integer 1–100
      const nCases = Math.floor(Math.random() * 100) + 1;

      // nCounterfeits: integer 0–nCases
      const nCounterfeits = Math.floor(Math.random() * (nCases + 1));

      const newAlert: AlertResponseDto = {
        ...alert,
        id: crypto.randomUUID(),
        lastModifiedAt: new Date(),
        lastModifiedBy: 'mock-user',
        nCases: nCases, //This should be a number between 1 and 100
        nCounterfeits: nCounterfeits, //This should be a number equal or less than nCases
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

      // --- Refresh nCases & nCounterfeits (same logic as create()) ---
      const nCases = Math.floor(Math.random() * 100) + 1; // 1–100
      const nCounterfeits = Math.floor(Math.random() * (nCases + 1)); // 0–nCases

      // Update only editable fields
      existing.name = alert.name ?? existing.name;
      existing.filtersAQL = alert.filtersAQL ?? existing.filtersAQL;
      existing.active = alert.active ?? existing.active;
      existing.lastModifiedAt = new Date();
      existing.lastModifiedBy = 'mock-user';
      existing.nCases = nCases;
      existing.nCounterfeits = nCounterfeits;

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

  //------------------------------
  // CODE LISTS AND FIELD NAMES
  getAlertFieldNames(): Observable<AlertFieldNameDto[]> {
    return this.handleUnauthorized(() => this.ok(this.fieldNames));
  }
  getAlertCountryList(): Observable<AlertCodeListDto[]> {
    return this.handleUnauthorized(() => this.ok(this.countries));
  }
  getAlertDocTypeList(): Observable<AlertCodeListDto[]> {
    return this.handleUnauthorized(() => this.ok(this.docTypes));
  }
  getAlertSexList(): Observable<AlertCodeListDto[]> {
    return this.handleUnauthorized(() => this.ok(this.sexes));
  }
  //------------------------------
}
