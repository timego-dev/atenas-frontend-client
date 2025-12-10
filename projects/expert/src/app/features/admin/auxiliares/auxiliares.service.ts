import { inject, Injectable } from '@angular/core';
import { AuxiliarRequestDto } from '@shared/models/auxiliar/command/auxiliar-request.model';
import {
  AuxiliarFilterOptions,
  AuxiliarResponseDto,
} from '@shared/models/auxiliar/query/auxiliar-response.model';

import { AuxiliarRepositoryService } from '@shared/services/auxiliar-repository.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuxiliaresService {
  private readonly auxiliarRepositoryService = inject(AuxiliarRepositoryService);

  getAuxiliares(filter?: AuxiliarFilterOptions): Observable<AuxiliarResponseDto[]> {
    return this.auxiliarRepositoryService.getAll(filter);
  }

  getById(id: string): Observable<AuxiliarResponseDto> {
    return this.auxiliarRepositoryService.getById(id);
  }

  create(auxiliar: AuxiliarRequestDto): Observable<AuxiliarResponseDto> {
    return this.auxiliarRepositoryService.create(auxiliar);
  }

  update(id: string, auxiliar: AuxiliarRequestDto): Observable<AuxiliarResponseDto> {
    return this.auxiliarRepositoryService.update(id, auxiliar);
  }

  delete(id: string): Observable<void> {
    return this.auxiliarRepositoryService.delete(id);
  }
}
