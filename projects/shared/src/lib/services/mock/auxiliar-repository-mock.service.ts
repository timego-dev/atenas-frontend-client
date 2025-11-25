import { of, Observable, throwError } from 'rxjs';

import { AuxiliarRepositoryService } from '../auxiliar-repository.service';
import { GetAuxiliar } from '@shared/models/auxiliar/query/get-auxiliar-response.model';
import { FieldType, PostAuxiliar } from '@shared/models/auxiliar/command/post-auxiliar-request.model';

export class AuxiliarRepositoryMockService implements AuxiliarRepositoryService {
  private auxiliars: GetAuxiliar[] = [];

  constructor() {
    this.auxiliars = [...MOCK_AUXILIARS];
  }

  getAll(): Observable<GetAuxiliar[]> {
    return of(this.auxiliars);
  }

  getById(id: string): Observable<GetAuxiliar> {
    const aux = this.auxiliars.find(a => a.id === id);
    if (!aux) return throwError(() => new Error('Auxiliar not found'));
    return of({ ...aux }); // return a copy
  }

  create(postAux: PostAuxiliar): Observable<GetAuxiliar> {
    const id = crypto.randomUUID();

    const newAux: GetAuxiliar = {
      id,
      alias: postAux.alias,
      title: postAux.title,
      type: postAux.type,
      required: postAux.required,
      creationDate: postAux.creationDate,
      minValue: postAux.minValue,
      maxValue: postAux.maxValue,
      decimals: postAux.decimals,
      maxLength: postAux.maxLength,
      options: postAux.options.map(o => ({ code: o.code, description: o.description }))
    };

    this.auxiliars.push(newAux);
    return of(newAux);
  }

  update(id: string, postAux: PostAuxiliar): Observable<GetAuxiliar> {
    const index = this.auxiliars.findIndex(a => a.id === id);
    if (index === -1) return throwError(() => new Error('Auxiliar not found'));

    const updated: GetAuxiliar = {
      id,
      alias: postAux.alias,
      title: postAux.title,
      type: postAux.type,
      required: postAux.required,
      creationDate: postAux.creationDate,
      minValue: postAux.minValue,
      maxValue: postAux.maxValue,
      decimals: postAux.decimals,
      maxLength: postAux.maxLength,
      options: postAux.options.map(o => ({ code: o.code, description: o.description }))
    };

    this.auxiliars[index] = updated;
    return of({ ...updated });
  }

  delete(id: string): Observable<void> {
    const index = this.auxiliars.findIndex(a => a.id === id);
    if (index === -1) return throwError(() => new Error('Auxiliar not found'));
    this.auxiliars.splice(index, 1);
    return of(undefined);
  }
}

export const MOCK_AUXILIARS: GetAuxiliar[] = 
[
  {
    "id": "08de26bb-4837-4fbc-81cb-5f32c24b1acc",
    "alias": "budgetary management",
    "title": "Nesciunt explicabo dignissimos.",
    "type": FieldType.List,
    "required": true,
    "creationDate":  new Date("2025-02-28T19:49:02.279135"),
    "minValue": null,
    "maxValue": null,
    "decimals": null,
    "maxLength": null,
    "options": []
  },
  {
    "id": "08de26bb-483d-4df3-80cf-1d2048e00d82",
    "alias": "Computers & Electronics",
    "title": "Eum perspiciatis perferendis.",
    "type": FieldType.CurrencyEuro,
    "required": true,
    "creationDate":  new Date("2025-10-14T20:38:41.144594"),
    "minValue": null,
    "maxValue": null,
    "decimals": null,
    "maxLength": null,
    "options": []
  },
  {
    "id": "08de26bb-483e-44b0-85a5-81acfafebac3",
    "alias": "innovate",
    "title": "Possimus vero dolores.",
    "type": FieldType.List,
    "required": false,
    "creationDate":  new Date("2024-10-23T14:19:34.189036"),
    "minValue": null,
    "maxValue": null,
    "decimals": null,
    "maxLength": null,
    "options": []
  },
  {
    "id": "08de26bb-483e-460d-8864-c732b797b9cc",
    "alias": "Credit Card Account",
    "title": "Molestiae dolor sed.",
    "type": FieldType.CurrencyEuro,
    "required": true,
    "creationDate":  new Date("2025-10-21T18:29:00.809827"),
    "minValue": null,
    "maxValue": null,
    "decimals": null,
    "maxLength": null,
    "options": []
  }
  
]
