import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import {
  AlertCodeListDto,
  AlertFieldNameDto,
  AlertResponseDto,
} from '@shared/models/alert/query/alert-response.model';
import { AlertRequestDto } from '@shared/models/alert/command/alert-request.model';

export abstract class AlertRepositoryService {
  // -------------------------------
  // ALERT
  // -------------------------------

  /** GET /alert */
  abstract getAll(): Observable<AlertResponseDto[]>;

  /** GET /alert/{id} */
  abstract getById(id: string): Observable<AlertResponseDto>;

  /** POST /alert */
  abstract create(alert: AlertRequestDto): Observable<AlertResponseDto>;

  /** PUT /alert */
  abstract update(id: string, user: AlertRequestDto): Observable<AlertResponseDto>;

  /** DELETE /alert/{id} */
  abstract delete(id: string): Observable<void>;

  abstract getAlertFieldNames(): Observable<AlertFieldNameDto[]>;
  abstract getAlertCountryList(): Observable<AlertCodeListDto[]>;
  abstract getAlertDocTypeList(): Observable<AlertCodeListDto[]>;
  abstract getAlertSexList(): Observable<AlertCodeListDto[]>;
}

export class AlertRepositoryRemoteService implements AlertRepositoryService {
  private readonly configurationService = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = this.configurationService.getConfig().backend?.url + '/alert';
  }

  // -------------------------------
  // ALERT
  // -------------------------------

  /** GET /alert */
  getAll(): Observable<AlertResponseDto[]> {
    return this.http.get<AlertResponseDto[]>(this.baseUrl);
  }

  /** GET /alert/{id} */
  getById(id: string): Observable<AlertResponseDto> {
    return this.http.get<AlertResponseDto>(`${this.baseUrl}/${id}`);
  }

  /** POST /alert */
  create(user: AlertRequestDto): Observable<AlertResponseDto> {
    return this.http.post<AlertResponseDto>(this.baseUrl, user);
  }

  /** PUT /alert/{id} */
  update(id: string, user: AlertRequestDto): Observable<AlertResponseDto> {
    return this.http.put<AlertResponseDto>(`${this.baseUrl}/${id}`, user);
  }

  /** DELETE /alert/{id} */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAlertFieldNames(): Observable<AlertFieldNameDto[]> {
    return this.http.get<AlertFieldNameDto[]>(`${this.baseUrl}/field-names`);
  }
  getAlertCountryList(): Observable<AlertCodeListDto[]> {
    return this.http.get<AlertCodeListDto[]>(`${this.baseUrl}/codelists/countries`);
  }
  getAlertDocTypeList(): Observable<AlertCodeListDto[]> {
    return this.http.get<AlertCodeListDto[]>(`${this.baseUrl}/codelists/doc-types`);
  }
  getAlertSexList(): Observable<AlertCodeListDto[]> {
    return this.http.get<AlertCodeListDto[]>(`${this.baseUrl}/codelists/sexes`);
  }
}
