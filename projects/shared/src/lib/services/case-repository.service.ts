import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { AthenasMessageDto } from '@shared/models/case/command/athenas-message.dto';
import { AuxiliarValueRequestDto } from '@shared/models/auxiliar/command/auxiliar-request.model';

export abstract class CaseRepositoryService {
  abstract getAll(): Observable<CaseSummaryDto[]>;
  abstract getById(id: string): Observable<CaseDto>;
  abstract create(message: AthenasMessageDto, files: File[]): Observable<CaseDto>;
  abstract addActivity(id: string, message: AthenasMessageDto, files: File[]): Observable<CaseDto>;
  abstract assignExpert(id: string, expertId: string): Observable<CaseDto>;
  abstract updateAuxiliarValues(id: string, values: AuxiliarValueRequestDto[]): Observable<CaseDto>;
  abstract delete(id: string): Observable<void>;
}

export class CaseRepositoryRemoteService implements CaseRepositoryService {
  private readonly config = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    console.log('config', this.config.getConfig());
    this.baseUrl = this.config.getConfig().backend?.url + '/case';
    console.log('baseUrl', this.baseUrl);
  }

  getAll(): Observable<CaseSummaryDto[]> {
    return this.http.get<CaseSummaryDto[]>(`${this.baseUrl}`);
  }

  getById(id: string): Observable<CaseDto> {
    return this.http.get<CaseDto>(`${this.baseUrl}/${id}`);
  }

  create(message: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    const form = new FormData();

    // Text JSON part
    form.append('message', JSON.stringify(message));

    // Binary files
    for (const file of files) {
      form.append(file.name, file);
    }

    return this.http.post<CaseDto>(`${this.baseUrl}`, form);
  }

  addActivity(id: string, message: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    const form = new FormData();

    form.append('message', JSON.stringify(message));

    if (files?.length) {
      for (const file of files) {
        form.append(file.name, file);
      }
    }

    return this.http.post<CaseDto>(`${this.baseUrl}/${id}/activities`, form);
  }

  updateAuxiliarValues(id: string, values: AuxiliarValueRequestDto[]): Observable<CaseDto> {
    return this.http.put<CaseDto>(`${this.baseUrl}/${id}/auxiliar-values`, values);
  }

  assignExpert(id: string, expertId: string | null): Observable<CaseDto> {
    return this.http.patch<CaseDto>(`${this.baseUrl}/${id}/expert`, {
      expertId: expertId,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
