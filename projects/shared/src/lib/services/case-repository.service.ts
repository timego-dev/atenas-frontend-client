import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { AthenasMessageDto } from '@shared/models/case/command/athenas-message.dto';


export abstract class CaseRepositoryService {
  abstract getAll(): Observable<CaseSummaryDto[]>;
  abstract getById(id: string): Observable<CaseDto>;
  abstract create(message: AthenasMessageDto, files: File[]): Observable<CaseDto>;
  abstract update(id: string, message: AthenasMessageDto, files: File[]): Observable<CaseDto>;
  abstract delete(id: string): Observable<void>;
}

export class CaseRepositoryRemoteService implements CaseRepositoryService {
  private readonly config = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = this.config.getConfig().backend.casesBaseUrl;
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
    form.append("message", JSON.stringify(message));

    // Binary files
    for (const file of files) {
      form.append("files", file, file.name);
    }

    return this.http.post<CaseDto>(`${this.baseUrl}`, form);
  }

  update(id: string, message: AthenasMessageDto, files: File[]): Observable<CaseDto> {

    const form = new FormData();

    // Always include the message JSON
    form.append("message", JSON.stringify(message));

    // Only append files if there are any
    if (files && files.length > 0) {
      for (const file of files) {
        form.append("files", file, file.name);
      }
    }

    // Send as multipart/form-data ALWAYS
    return this.http.put<CaseDto>(`${this.baseUrl}/${id}`, form);
  }


  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
