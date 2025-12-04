import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import {
  AuxiliarResponseDto,
  AuxiliarFilterOptions,
} from '@shared/models/auxiliar/query/auxiliar-response.model';
import { AuxiliarRequestDto } from '@shared/models/auxiliar/command/auxiliar-request.model';

export abstract class AuxiliarRepositoryService {
  abstract getAll(filter?: AuxiliarFilterOptions): Observable<AuxiliarResponseDto[]>;
  abstract getById(id: string): Observable<AuxiliarResponseDto>;
  abstract create(auxiliar: AuxiliarRequestDto): Observable<AuxiliarResponseDto>;
  abstract update(id: string, auxiliar: AuxiliarRequestDto): Observable<AuxiliarResponseDto>;
  abstract delete(id: string): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class AuxiliarRepositoryRemoteService implements AuxiliarRepositoryService {
  private readonly config = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = this.config.getConfig().backend?.url + '/auxiliar';
  }

  getAll(filter?: AuxiliarFilterOptions): Observable<AuxiliarResponseDto[]> {
    // If filter exists, convert Dates to ISO strings for query params
    const params: any = { ...filter };
    if (filter?.creationDateFrom) params.creationDateFrom = filter.creationDateFrom.toISOString();
    if (filter?.creationDateTo) params.creationDateTo = filter.creationDateTo.toISOString();

    return this.http.get<AuxiliarResponseDto[]>(`${this.baseUrl}`, { params });
  }

  getById(id: string): Observable<AuxiliarResponseDto> {
    return this.http.get<AuxiliarResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(auxiliar: AuxiliarRequestDto): Observable<AuxiliarResponseDto> {
    return this.http.post<AuxiliarResponseDto>(`${this.baseUrl}`, auxiliar);
  }

  update(id: string, auxiliar: AuxiliarRequestDto): Observable<AuxiliarResponseDto> {
    return this.http.put<AuxiliarResponseDto>(`${this.baseUrl}/${id}`, auxiliar);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
