import { Injectable, inject } from '@angular/core';
import { CaseRepositoryService } from '@shared';
import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { CaseResolution, CaseStatus } from '@shared/models/shared.enums';
import dayjs from 'dayjs';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private readonly caseRepositoryService = inject(CaseRepositoryService);

  private readonly consultasCompletas$ = new ReplaySubject<CaseSummaryDto[]>(1);

  private readonly filtros$ = new BehaviorSubject<FiltroConsultas>(<FiltroConsultas>{});

  public readonly consultasFiltradas$: Observable<CaseSummaryDto[]> = combineLatest([
    this.consultasCompletas$,
    this.filtros$,
  ]).pipe(map(([consultas, filtros]) => this.filtrarConsultas(consultas, filtros)));

  constructor() {
    this.caseRepositoryService.getAll().subscribe({
      next: (data) => this.consultasCompletas$.next(data),
      error: (err) => console.error('Error al cargar consultas:', err),
    });
  }

  applyFilter(filters: FiltroConsultas): void {
    this.filtros$.next(filters);
  }

  getById(id: string): Observable<CaseDto> {
    return this.caseRepositoryService.getById(id);
  }

  private filtrarConsultas(
    consultas: CaseSummaryDto[],
    filters: FiltroConsultas
  ): CaseSummaryDto[] {
    let resultado = [...consultas];

    if (filters.respuesta?.length) {
      resultado = resultado.filter((c) => filters.respuesta.includes(c.caseResolution!));
    }

    if (filters.estado?.length) {
      resultado = resultado.filter(
        (c) =>
          (c.caseStatus === CaseStatus.PENDING && filters.estado.includes(CaseStatus.PENDING)) ||
          (c.caseStatus === CaseStatus.OPEN && filters.estado.includes(CaseStatus.OPEN)) ||
          (c.caseStatus === CaseStatus.SOLVED && filters.estado.includes(CaseStatus.SOLVED)) ||
          (c.caseStatus === CaseStatus.ARCHIVED && filters.estado.includes(CaseStatus.ARCHIVED))
      );
    }

    if (filters.periodo !== undefined) {
      const ahora = dayjs();
      switch (filters.periodo) {
        case FiltroPeriodo.HOY: {
          resultado = resultado.filter((c) => dayjs(c.creationDate).isSame(ahora, 'day'));
          break;
        }
        case FiltroPeriodo.ESTA_SEMANA: {
          resultado = resultado.filter((c) => dayjs(c.creationDate).isAfter(ahora.startOf('week')));
          break;
        }
        case FiltroPeriodo.ESTE_MES: {
          resultado = resultado.filter((c) =>
            dayjs(c.creationDate).isAfter(ahora.startOf('month'))
          );
          break;
        }
        case FiltroPeriodo.ESTE_AÑO: {
          resultado = resultado.filter((c) => dayjs(c.creationDate).isAfter(ahora.startOf('year')));
          break;
        }
      }
    }

    return resultado;
  }
}

export enum FiltroPeriodo {
  HOY,
  ESTA_SEMANA,
  ESTE_MES,
  ESTE_AÑO,
}

export interface FiltroConsultas {
  estado: CaseStatus[];
  respuesta: CaseResolution[];
  periodo: FiltroPeriodo | undefined;
}

/*
// TODO: Move to shared

export enum CaseResolution {
  WITH_EVIDENCES,
  WITHOUT_EVIDENCES,
  PENDING,
  INVALID_DOCUMENT,
  INSUFFICIENT_QUALITY,
}
export enum CaseStatus {
  PENDING,
  OPEN,
  SOLVED,
  ARCHIVED,
  CLARIFICATION_PENDING,
}

export interface IConsulta {
  id: string;
  trackingNumber: string;
  creatorName: string;
  creationDate: Date;
  lastUpdated: Date | undefined;
  expertName: string | undefined;
  caseStatus: CaseStatus;
  caseResolution: CaseResolution | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ConsultasRepositoryService {
  getAll(): Observable<IConsulta[]> {
    return of(<IConsulta[]>[
      {
        trackingNumber: '123456',
        creatorName: 'Patrulla1',
        creationDate: dayjs().add(-10, 'second').toDate(),
        lastUpdated: undefined,
        expertName: undefined,
        caseStatus: CaseStatus.PENDING,
      },
      {
        trackingNumber: '123456',
        creatorName: 'Patrulla1',
        creationDate: dayjs().add(-30, 'second').toDate(),
        lastUpdated: undefined,
        expertName: 'Operador1',
        caseStatus: CaseStatus.OPEN,
      },
      {
        trackingNumber: '128431',
        creatorName: 'Patrulla2',
        creationDate: dayjs().add(-5, 'minute').toDate(),
        lastUpdated: undefined,
        expertName: undefined,
        caseStatus: CaseStatus.PENDING,
      },
      {
        trackingNumber: '128930',
        creatorName: 'Patrulla2',
        creationDate: dayjs().add(-8, 'minute').toDate(),
        lastUpdated: dayjs().add(-6, 'minute').toDate(),
        expertName: 'Operador1',
        caseStatus: CaseStatus.SOLVED,
        caseResolution: CaseResolution.WITHOUT_EVIDENCES,
      },
      {
        trackingNumber: '128787',
        creatorName: 'Patrulla2',
        creationDate: dayjs().add(-15, 'minute').toDate(),
        lastUpdated: dayjs().add(-12, 'minute').toDate(),
        expertName: 'Operador1',
        caseStatus: CaseStatus.SOLVED,
        caseResolution: CaseResolution.WITH_EVIDENCES,
      },
      {
        trackingNumber: '128787',
        creatorName: 'Patrulla2',
        creationDate: dayjs().add(-25, 'minute').toDate(),
        lastUpdated: dayjs().add(-24, 'minute').toDate(),
        expertName: 'Operador2',
        caseStatus: CaseStatus.SOLVED,
        caseResolution: CaseResolution.PENDING,
      },
      {
        trackingNumber: '456789',
        creatorName: 'Patrulla1',
        creationDate: dayjs().add(-3, 'day').toDate(),
        lastUpdated: dayjs().add(-3, 'day').add(2, 'minute').toDate(),
        expertName: 'Operador1',
        caseStatus: CaseStatus.SOLVED,
        caseResolution: CaseResolution.WITHOUT_EVIDENCES,
      },
      {
        trackingNumber: '784743',
        creatorName: 'Patrulla6',
        creationDate: dayjs().add(-7, 'day').toDate(),
        lastUpdated: dayjs().add(-7, 'day').add(1, 'minute').toDate(),
        expertName: 'Operador3',
        caseStatus: CaseStatus.SOLVED,
        caseResolution: CaseResolution.WITHOUT_EVIDENCES,
      },
      {
        trackingNumber: '846765',
        creatorName: 'Patrulla3',
        creationDate: dayjs().add(-9, 'day').toDate(),
        lastUpdated: dayjs().add(-9, 'day').add(5, 'minute').toDate(),
        expertName: 'Operador3',
        caseStatus: CaseStatus.SOLVED,
        caseResolution: CaseResolution.WITHOUT_EVIDENCES,
      },
      {
        trackingNumber: '567832',
        creatorName: 'Patrulla2',
        creationDate: dayjs().add(-30, 'day').toDate(),
        lastUpdated: dayjs().add(-30, 'day').add(5, 'minute').toDate(),
        expertName: 'Operador4',
        caseStatus: CaseStatus.ARCHIVED,
        caseResolution: CaseResolution.WITHOUT_EVIDENCES,
      },
      {
        trackingNumber: '846745',
        creatorName: 'Patrulla1',
        creationDate: dayjs().add(-34, 'day').toDate(),
        lastUpdated: dayjs().add(-34, 'day').add(2, 'minute').toDate(),
        expertName: 'Operador3',
        caseStatus: CaseStatus.SOLVED,
        caseResolution: CaseResolution.PENDING,
      },
      {
        trackingNumber: '111552',
        creatorName: 'Patrulla1',
        creationDate: dayjs().add(-370, 'day').toDate(),
        lastUpdated: dayjs().add(-370, 'day').add(2, 'minute').toDate(),
        expertName: 'Operador3',
        caseStatus: CaseStatus.SOLVED,
        caseResolution: CaseResolution.PENDING,
      },
    ]);
  }
}
*/
