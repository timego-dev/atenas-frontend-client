import { of, Observable, throwError } from 'rxjs';

import { AuxiliarRepositoryService } from '../auxiliar-repository.service';

import { BaseMockApiService } from './base-mock-api.service';
import {
  AuxiliarResponseDto,
  FieldType,
} from '@shared/models/auxiliar/query/auxiliar-response.model';
import { AuxiliarRequestDto } from '@shared/models/auxiliar/command/auxiliar-request.model';

export class AuxiliarRepositoryMockService
  extends BaseMockApiService
  implements AuxiliarRepositoryService
{
  private auxiliars: AuxiliarResponseDto[] = [...MOCK_AUXILIARS];

  getAll(): Observable<AuxiliarResponseDto[]> {
    return this.handleUnauthorized(() => this.ok(this.auxiliars));
  }

  getById(id: string): Observable<AuxiliarResponseDto> {
    return this.handleUnauthorized(() => {
      const aux = this.auxiliars.find((a) => a.id === id);
      if (!aux) return this.notFound();
      return this.ok({ ...aux });
    });
  }

  create(postAux: AuxiliarRequestDto): Observable<AuxiliarResponseDto> {
    return this.handleUnauthorized(() => {
      const errors = AuxiliarValidator.validate(postAux);
      if (errors.length > 0) {
        return this.badRequest(errors);
      }

      const newAux: AuxiliarResponseDto = {
        id: crypto.randomUUID(),
        alias: postAux.alias,
        title: postAux.title,
        type: postAux.type,
        required: postAux.required,
        creationDate: new Date(),
        minValue: postAux.minValue,
        maxValue: postAux.maxValue,
        decimals: postAux.decimals,
        maxLength: postAux.maxLength,
        options: postAux.options?.map((o) => ({ code: o.code, description: o.description })),
      };

      this.auxiliars.push(newAux);
      return this.ok(newAux);
    });
  }

  update(id: string, postAux: AuxiliarRequestDto): Observable<AuxiliarResponseDto> {
    return this.handleUnauthorized(() => {
      const errors = AuxiliarValidator.validate(postAux);
      if (errors.length > 0) {
        return this.badRequest(errors);
      }

      const index = this.auxiliars.findIndex((a) => a.id === id);
      if (index === -1) {
        return this.notFound();
      }

      const updated: AuxiliarResponseDto = {
        id,
        alias: postAux.alias,
        title: postAux.title,
        type: postAux.type,
        required: postAux.required,
        creationDate: new Date(),
        minValue: postAux.minValue,
        maxValue: postAux.maxValue,
        decimals: postAux.decimals,
        maxLength: postAux.maxLength,
        options: postAux.options.map((o) => ({ code: o.code, description: o.description })),
      };

      this.auxiliars[index] = updated;
      return this.ok({ ...updated });
    });
  }

  delete(id: string): Observable<void> {
    return this.handleUnauthorized(() => {
      const index = this.auxiliars.findIndex((a) => a.id === id);
      if (index === -1) return throwError(() => new Error('Auxiliar not found'));
      this.auxiliars.splice(index, 1);
      return of(undefined);
    });
  }
}

export const MOCK_AUXILIARS: AuxiliarResponseDto[] = [
  {
    id: '08de26bb-4837-4fbc-81cb-5f32c24b1acc',
    alias: 'budgetary management',
    title: 'Nesciunt explicabo dignissimos.',
    type: FieldType.List,
    required: true,
    creationDate: new Date('2025-02-28T19:49:02.279135'),
    minValue: null,
    maxValue: null,
    decimals: null,
    maxLength: null,
    options: [],
  },
  {
    id: '08de26bb-483d-4df3-80cf-1d2048e00d82',
    alias: 'Computers & Electronics',
    title: 'Eum perspiciatis perferendis.',
    type: FieldType.CurrencyEuro,
    required: true,
    creationDate: new Date('2025-10-14T20:38:41.144594'),
    minValue: null,
    maxValue: null,
    decimals: null,
    maxLength: null,
    options: [],
  },
  {
    id: '08de26bb-483e-44b0-85a5-81acfafebac3',
    alias: 'innovate',
    title: 'Possimus vero dolores.',
    type: FieldType.List,
    required: false,
    creationDate: new Date('2024-10-23T14:19:34.189036'),
    minValue: null,
    maxValue: null,
    decimals: null,
    maxLength: null,
    options: [],
  },
  {
    id: '08de26bb-483e-460d-8864-c732b797b9cc',
    alias: 'Credit Card Account',
    title: 'Molestiae dolor sed.',
    type: FieldType.CurrencyEuro,
    required: true,
    creationDate: new Date('2025-10-21T18:29:00.809827'),
    minValue: null,
    maxValue: null,
    decimals: null,
    maxLength: null,
    options: [],
  },
];

export class AuxiliarValidator {
  static validate(aux: AuxiliarRequestDto): string[] {
    const errors: string[] = [];

    // Type must be valid
    if (aux.type == null) {
      errors.push('Type must be a valid FieldType.');
    }

    const isNumeric =
      aux.type === 'Integer' || aux.type === 'Numeric' || aux.type === 'CurrencyEuro';

    // Numeric / Integer / Currency rules
    if (isNumeric) {
      if (aux.minValue == null) errors.push('MinValue is required for numeric or integer types.');

      if (aux.maxValue == null) errors.push('MaxValue is required for numeric or integer types.');

      if (aux.type === 'CurrencyEuro' && aux.decimals !== 2)
        errors.push('CurrencyEuro must have 2 decimals.');

      if (aux.type === 'Numeric' && aux.decimals == null)
        errors.push('Decimals is required for Numeric type.');
    }

    // Text rules
    if (aux.type === 'Text') {
      if (aux.maxLength == null) errors.push('MaxLength is required for Text type.');
    }

    // List rules
    if (aux.type === 'List') {
      if (!aux.options || aux.options.length === 0) {
        errors.push('Options are required for List type.');
      }

      // Option-level validation
      for (let i = 0; i < aux.options!.length; i++) {
        const o = aux.options![i];
        if (!o.code) errors.push(`Option ${i}: code is required.`);
        if (!o.description) errors.push(`Option ${i}: description is required.`);
      }
    }

    return errors;
  }
}
