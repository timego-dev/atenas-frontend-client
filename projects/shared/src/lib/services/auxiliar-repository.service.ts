import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { GetAuxiliar, AuxiliarFilterOptions } from '@shared/models/auxiliar/query/get-auxiliar-response.model';
import { PostAuxiliar } from '@shared/models/auxiliar/command/post-auxiliar-request.model';

export abstract class AuxiliarRepositoryService {
  abstract getAll(filter?: AuxiliarFilterOptions): Observable<GetAuxiliar[]>;
  abstract getById(id: string): Observable<GetAuxiliar>;
  abstract create(auxiliar: PostAuxiliar): Observable<GetAuxiliar>;
  abstract update(id: string, auxiliar: PostAuxiliar): Observable<GetAuxiliar>;
  abstract delete(id: string): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class AuxiliarRepositoryRemoteService implements AuxiliarRepositoryService {
  private readonly config = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = this.config.getConfig().backend.auxiliarBaseUrl;
  }

  getAll(filter?: AuxiliarFilterOptions): Observable<GetAuxiliar[]> {
    // If filter exists, convert Dates to ISO strings for query params
    const params: any = { ...filter };
    if (filter?.creationDateFrom) params.creationDateFrom = filter.creationDateFrom.toISOString();
    if (filter?.creationDateTo) params.creationDateTo = filter.creationDateTo.toISOString();

    return this.http.get<GetAuxiliar[]>(`${this.baseUrl}`, { params });
  }

  getById(id: string): Observable<GetAuxiliar> {
    return this.http.get<GetAuxiliar>(`${this.baseUrl}/${id}`);
  }

  create(auxiliar: PostAuxiliar): Observable<GetAuxiliar> {
    return this.http.post<GetAuxiliar>(`${this.baseUrl}`, auxiliar);
  }

  update(id: string, auxiliar: PostAuxiliar): Observable<GetAuxiliar> {
    return this.http.put<GetAuxiliar>(`${this.baseUrl}/${id}`, auxiliar);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}