import { Injectable, inject } from '@angular/core';
import dayjs from 'dayjs';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private readonly consultasRepositoryService = inject(ConsultasRepositoryService);

  private readonly consultasCompletas$ = new ReplaySubject<IConsulta[]>(1);

  private readonly filtros$ = new BehaviorSubject<FiltroConsultas>(<FiltroConsultas>{});

  public readonly consultasFiltradas$: Observable<IConsulta[]> = combineLatest([
    this.consultasCompletas$,
    this.filtros$,
  ]).pipe(map(([consultas, filtros]) => this.filtrarConsultas(consultas, filtros)));

  constructor() {
    this.consultasRepositoryService.getAll().subscribe({
      next: (data) => this.consultasCompletas$.next(data),
      error: (err) => console.error('Error al cargar consultas:', err),
    });
  }

  applyFilter(filters: FiltroConsultas): void {
    this.filtros$.next(filters);
  }

  private filtrarConsultas(consultas: IConsulta[], filters: FiltroConsultas): IConsulta[] {
    let resultado = [...consultas];

    if (filters.respuesta?.length) {
      resultado = resultado.filter((c) => filters.respuesta.includes(c.respuesta!));
    }

    if (filters.estado?.length) {
      resultado = resultado.filter(
        (c) =>
          (c.estado === EstadoConsulta.PENDIENTE &&
            filters.estado.includes(EstadoConsulta.PENDIENTE)) ||
          (c.estado === EstadoConsulta.ASIGNADA &&
            filters.estado.includes(EstadoConsulta.ASIGNADA)) ||
          (c.estado === EstadoConsulta.RESUELTA &&
            filters.estado.includes(EstadoConsulta.RESUELTA)) ||
          (c.estado === EstadoConsulta.ARCHIVADA &&
            filters.estado.includes(EstadoConsulta.ARCHIVADA))
      );
    }

    if (filters.periodo !== undefined) {
      const ahora = dayjs();
      switch (filters.periodo) {
        case FiltroPeriodo.HOY: {
          resultado = resultado.filter((c) => dayjs(c.fechaEntrada).isSame(ahora, 'day'));
          break;
        }
        case FiltroPeriodo.ESTA_SEMANA: {
          resultado = resultado.filter((c) => dayjs(c.fechaEntrada).isAfter(ahora.startOf('week')));
          break;
        }
        case FiltroPeriodo.ESTE_MES: {
          resultado = resultado.filter((c) =>
            dayjs(c.fechaEntrada).isAfter(ahora.startOf('month'))
          );
          break;
        }
        case FiltroPeriodo.ESTE_AÑO: {
          resultado = resultado.filter((c) => dayjs(c.fechaEntrada).isAfter(ahora.startOf('year')));
          break;
        }
      }
    }

    return resultado;
  }
}

// TODO: Move to shared

export enum RespuestaConsulta {
  FALSO,
  AUTENTICO,
  FALTA_INFORMACION,
}
export enum FiltroPeriodo {
  HOY,
  ESTA_SEMANA,
  ESTE_MES,
  ESTE_AÑO,
}

export interface FiltroConsultas {
  estado: EstadoConsulta[];
  respuesta: RespuestaConsulta[];
  periodo: FiltroPeriodo | undefined;
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
        fechaEntrada: dayjs().add(-3, 'day').toDate(),
        fechaRespuesta: dayjs().add(-3, 'day').add(2, 'minute').toDate(),
        operador: 'Operador1',
        estado: EstadoConsulta.RESUELTA,
        respuesta: RespuestaConsulta.AUTENTICO,
      },
      {
        referencia: '784743',
        origen: 'Patrulla6',
        fechaEntrada: dayjs().add(-7, 'day').toDate(),
        fechaRespuesta: dayjs().add(-7, 'day').add(1, 'minute').toDate(),
        operador: 'Operador3',
        estado: EstadoConsulta.RESUELTA,
        respuesta: RespuestaConsulta.AUTENTICO,
      },
      {
        referencia: '846765',
        origen: 'Patrulla3',
        fechaEntrada: dayjs().add(-9, 'day').toDate(),
        fechaRespuesta: dayjs().add(-9, 'day').add(5, 'minute').toDate(),
        operador: 'Operador3',
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
      {
        referencia: '846745',
        origen: 'Patrulla1',
        fechaEntrada: dayjs().add(-34, 'day').toDate(),
        fechaRespuesta: dayjs().add(-34, 'day').add(2, 'minute').toDate(),
        operador: 'Operador3',
        estado: EstadoConsulta.RESUELTA,
        respuesta: RespuestaConsulta.FALTA_INFORMACION,
      },
      {
        referencia: '111552',
        origen: 'Patrulla1',
        fechaEntrada: dayjs().add(-370, 'day').toDate(),
        fechaRespuesta: dayjs().add(-370, 'day').add(2, 'minute').toDate(),
        operador: 'Operador3',
        estado: EstadoConsulta.RESUELTA,
        respuesta: RespuestaConsulta.FALTA_INFORMACION,
      },
    ]);
  }
}
