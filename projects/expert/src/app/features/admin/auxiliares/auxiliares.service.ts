import { inject, Injectable } from '@angular/core';
import { PostAuxiliar } from '@shared/models/auxiliar/command/post-auxiliar-request.model';
import {
  AuxiliarFilterOptions,
  GetAuxiliar,
} from '@shared/models/auxiliar/query/get-auxiliar-response.model';
import { AuxiliarRepositoryService } from '@shared/services/auxiliar-repository.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuxiliaresService {
  private readonly auxiliarRepositoryService = inject(AuxiliarRepositoryService);

  getAuxiliares(filter?: AuxiliarFilterOptions): Observable<GetAuxiliar[]> {
    return this.auxiliarRepositoryService.getAll(filter);
  }

  getById(id: string): Observable<GetAuxiliar> {
    return this.getById(id);
  }

  create(auxiliar: PostAuxiliar): Observable<GetAuxiliar> {
    return this.auxiliarRepositoryService.create(auxiliar);
  }

  update(id: string, auxiliar: PostAuxiliar): Observable<GetAuxiliar> {
    return this.auxiliarRepositoryService.update(id, auxiliar);
  }

  delete(id: string): Observable<void> {
    return this.auxiliarRepositoryService.delete(id);
  }
}
