import { Injectable, inject } from '@angular/core';
import { CaseRepositoryService } from '@shared';
import { CaseResolution, CaseStatus } from '@shared/models/case/case.enums';
import { AthenasMessageDto } from '@shared/models/case/command/athenas-message.dto';
import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import dayjs from 'dayjs';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private readonly caseRepositoryService = inject(CaseRepositoryService);

  private readonly allCases = new ReplaySubject<CaseSummaryDto[]>(1);

  private readonly filters = new BehaviorSubject<CaseFilters>(<CaseFilters>{});

  public readonly caseList: Observable<CaseSummaryDto[]> = combineLatest([
    this.allCases,
    this.filters,
  ]).pipe(map(([caseList, filters]) => this.filterCases(caseList, filters)));

  constructor() {
    this.caseRepositoryService.getAll().subscribe({
      next: (data) => this.allCases.next(data),
      error: (err) => console.error('Error al cargar consultas:', err),
    });
  }

  applyFilter(filters: CaseFilters): void {
    this.filters.next(filters);
  }

  getById(id: string): Observable<CaseDto> {
    return this.caseRepositoryService.getById(id);
  }

  createCase(caseCommand: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    return this.caseRepositoryService.create(caseCommand, files);
  }

  private filterCases(caseList: CaseSummaryDto[], filters: CaseFilters): CaseSummaryDto[] {
    let resultado = [...caseList];

    if (filters.response?.length) {
      resultado = resultado.filter((c) => filters.response.includes(c.caseResolution!));
    }

    if (filters.status?.length) {
      resultado = resultado.filter(
        (c) =>
          (c.caseStatus === CaseStatus.PENDING && filters.status.includes(CaseStatus.PENDING)) ||
          (c.caseStatus === CaseStatus.OPEN && filters.status.includes(CaseStatus.OPEN)) ||
          (c.caseStatus === CaseStatus.SOLVED && filters.status.includes(CaseStatus.SOLVED)) ||
          (c.caseStatus === CaseStatus.ARCHIVED && filters.status.includes(CaseStatus.ARCHIVED))
      );
    }

    if (filters.period !== undefined) {
      const ahora = dayjs();
      switch (filters.period) {
        case DateRangeFilter.TODAY: {
          resultado = resultado.filter((c) => dayjs(c.creationDate).isSame(ahora, 'day'));
          break;
        }
        case DateRangeFilter.THIS_WEEK: {
          resultado = resultado.filter((c) => dayjs(c.creationDate).isAfter(ahora.startOf('week')));
          break;
        }
        case DateRangeFilter.THIS_MONTH: {
          resultado = resultado.filter((c) =>
            dayjs(c.creationDate).isAfter(ahora.startOf('month'))
          );
          break;
        }
        case DateRangeFilter.THIS_YEAR: {
          resultado = resultado.filter((c) => dayjs(c.creationDate).isAfter(ahora.startOf('year')));
          break;
        }
      }
    }

    return resultado;
  }
}

export enum DateRangeFilter {
  TODAY,
  THIS_WEEK,
  THIS_MONTH,
  THIS_YEAR,
}

export interface CaseFilters {
  status: CaseStatus[];
  response: CaseResolution[];
  period: DateRangeFilter | undefined;
}
