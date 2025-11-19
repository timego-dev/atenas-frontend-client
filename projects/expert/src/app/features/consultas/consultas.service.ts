import { Injectable, inject } from '@angular/core';
import dayjs from 'dayjs';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private readonly consultasRepositoryService = inject(ConsultasRepositoryService);

  // Datos originales (sin filtrar)
  private readonly consultasCompletas$ = new ReplaySubject<IConsulta[]>(1);

  // Filtros actuales
  private readonly filtros$ = new BehaviorSubject<FiltroConsultas>(<FiltroConsultas>{});

  // Lista filtrada, combinando datos + filtros
  public readonly consultasFiltradas$: Observable<IConsulta[]> = combineLatest([
    this.consultasCompletas$,
    this.filtros$,
  ]).pipe(map(([consultas, filtros]) => this.filtrarConsultas(consultas, filtros)));

  constructor() {
    // Cargar datos una sola vez al iniciar
    this.consultasRepositoryService.getAll().subscribe({
      next: (data) => this.consultasCompletas$.next(data),
      error: (err) => console.error('Error al cargar consultas:', err),
    });
  }

  /**
   * Método público que la UI puede llamar para aplicar nuevos filtros.
   * Esto actualiza el BehaviorSubject de filtros, lo que dispara una nueva emisión en `consultasFiltradas$`.
   */
  applyFilter(filters: FiltroConsultas): void {
    this.filtros$.next(filters);
  }

  /**
   * Lógica de filtrado (ajusta según tu modelo de `ConsultasFilters` y `IConsulta`)
   */
  private filtrarConsultas(consultas: IConsulta[], filters: FiltroConsultas): IConsulta[] {
    let resultado = [...consultas];

    if (filters.respuesta) {
      resultado = resultado.filter((c) => c.respuesta === filters.respuesta);
    }

    if (filters.estado) {
      resultado = resultado.filter(
        (c) =>
          filters.estado == EstadoFiltro.TODAS ||
          (c.estado === EstadoConsulta.PENDIENTE && filters.estado === EstadoFiltro.PENDIENTES) ||
          (c.estado === EstadoConsulta.RESUELTA && filters.estado === EstadoFiltro.RESUELTAS) ||
          (c.estado === EstadoConsulta.ARCHIVADA && filters.estado === EstadoFiltro.ARCHIVADAS)
      );
    }

    return resultado;
  }
}

// TODO: Move to shared

enum EstadoFiltro {
  TODAS,
  PENDIENTES,
  RESUELTAS,
  ARCHIVADAS,
}
export enum RespuestaConsulta {
  FALSO,
  AUTENTICO,
  FALTA_INFORMACION,
}
enum PeriodFilter {
  HOY,
  ESTA_SEMANA,
  ESTE_MES,
  ESTE_AÑO,
}

export interface FiltroConsultas {
  estado: EstadoFiltro | undefined;
  respuesta: RespuestaConsulta | undefined;
  periodo: PeriodFilter | undefined;
}

export enum EstadoConsulta {
  PENDIENTE,
  ASIGNADA,
  RESUELTA,
  ARCHIVADA,
}

export interface IConsulta {
  id: string;
  referencia: string;
  origen: string;
  fechaEntrada: Date;
  fechaRespuesta: Date | undefined;
  operador: string | undefined;
  estado: EstadoConsulta;
  respuesta: RespuestaConsulta | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ConsultasRepositoryService {
  getAll(): Observable<IConsulta[]> {
    return of(<IConsulta[]>[
      {
        referencia: '123456',
        origen: 'Patrulla1',
        fechaEntrada: dayjs().add(-10, 'second').toDate(),
        fechaRespuesta: undefined,
        operador: undefined,
        estado: EstadoConsulta.PENDIENTE,
      },
      {
        referencia: '123456',
        origen: 'Patrulla1',
        fechaEntrada: dayjs().add(-30, 'second').toDate(),
        fechaRespuesta: undefined,
        operador: 'Operador1',
        estado: EstadoConsulta.ASIGNADA,
      },
      {
        referencia: '128431',
        origen: 'Patrulla2',
        fechaEntrada: dayjs().add(-5, 'minute').toDate(),
        fechaRespuesta: undefined,
        operador: undefined,
        estado: EstadoConsulta.PENDIENTE,
      },
      {
        referencia: '128930',
        origen: 'Patrulla2',
        fechaEntrada: dayjs().add(-8, 'minute').toDate(),
        fechaRespuesta: dayjs().add(-6, 'minute').toDate(),
        operador: 'Operador1',
        estado: EstadoConsulta.RESUELTA,
        respuesta: RespuestaConsulta.AUTENTICO,
      },
      {
        referencia: '128787',
        origen: 'Patrulla2',
        fechaEntrada: dayjs().add(-15, 'minute').toDate(),
        fechaRespuesta: dayjs().add(-12, 'minute').toDate(),
        operador: 'Operador1',
        estado: EstadoConsulta.RESUELTA,
        respuesta: RespuestaConsulta.FALSO,
      },
      {
        referencia: '128787',
        origen: 'Patrulla2',
        fechaEntrada: dayjs().add(-25, 'minute').toDate(),
        fechaRespuesta: dayjs().add(-24, 'minute').toDate(),
        operador: 'Operador2',
        estado: EstadoConsulta.RESUELTA,
        respuesta: RespuestaConsulta.FALTA_INFORMACION,
      },
      {
        referencia: '456789',
        origen: 'Patrulla1',
        fechaEntrada: dayjs().add(-30, 'minute').toDate(),
        fechaRespuesta: dayjs().add(-29, 'minute').toDate(),
        operador: 'Operador1',
        estado: EstadoConsulta.RESUELTA,
        respuesta: RespuestaConsulta.AUTENTICO,
      },
      {
        referencia: '567832',
        origen: 'Patrulla2',
        fechaEntrada: dayjs().add(-30, 'day').toDate(),
        fechaRespuesta: dayjs().add(-30, 'day').add(5, 'minute').toDate(),
        operador: 'Operador4',
        estado: EstadoConsulta.ARCHIVADA,
        respuesta: RespuestaConsulta.AUTENTICO,
      },
    ]);
  }
}
