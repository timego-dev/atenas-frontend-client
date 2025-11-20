import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {
  ConsultasService,
  EstadoConsulta,
  FiltroPeriodo,
  RespuestaConsulta,
} from './consultas.service';

import { IConsulta } from './consultas.service';
import { TiempoEntrada } from '../../shared/components/tiempo-entrada.component';
import { TiempoRespuesta } from '../../shared/components/tiempo-respuesta.component';
import { EstadoConsultaComponent } from '../../shared/components/estado-consulta.component';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'page-consultas',
  standalone: true,
  imports: [
    PanelModule,
    MenuModule,
    TableModule,
    ButtonModule,
    TagModule,
    TiempoEntrada,
    TiempoRespuesta,
    EstadoConsultaComponent,
    SelectModule,
    FormsModule,
    MultiSelectModule,
  ],
  templateUrl: './consultas.page.html',
  providers: [],
})
export class ConsultasPage {
  private readonly consultasService = inject(ConsultasService);

  protected consultas: IConsulta[] = [];
  private readonly ref = inject(ChangeDetectorRef);

  constructor() {
    this.consultasService.consultasFiltradas$.subscribe((data) => {
      this.consultas = data;
    });
    setInterval(() => this.ref.detectChanges(), 1000);
  }

  estados = [
    { label: 'Pendientes', value: EstadoConsulta.PENDIENTE },
    { label: 'En curso', value: EstadoConsulta.ASIGNADA },
    { label: 'Resueltas', value: EstadoConsulta.RESUELTA },
    { label: 'Archivadas', value: EstadoConsulta.ARCHIVADA },
  ];

  estado = <EstadoConsulta[]>[];

  respuestas = [
    { label: 'Autenticos', value: RespuestaConsulta.AUTENTICO },
    { label: 'Falsos', value: RespuestaConsulta.FALSO },
    { label: 'Falta información', value: RespuestaConsulta.FALTA_INFORMACION },
  ];

  respuesta = <RespuestaConsulta[]>[];

  periodos = [
    { label: 'Hoy', value: FiltroPeriodo.HOY },
    { label: 'Esta semana', value: FiltroPeriodo.ESTA_SEMANA },
    { label: 'Este mes', value: FiltroPeriodo.ESTE_MES },
    { label: 'Este año', value: FiltroPeriodo.ESTE_AÑO },
  ];

  periodo = <FiltroPeriodo | undefined>undefined;

  cols: Column[] = [
    { field: 'code', header: 'Referencia' },
    { field: 'name', header: 'Entrada' },
    { field: 'image', header: 'Origen' },
    { field: 'price', header: 'Tiempo respuesta' },
    { field: 'category', header: 'Operador' },
    { field: 'category', header: 'Estado' },
  ];

  editConsulta(consulta: IConsulta) {
    console.log('Edit', consulta);
  }

  filterChange(event: SelectChangeEvent) {
    this.consultasService.applyFilter({
      estado: this.estado,
      respuesta: this.respuesta,
      periodo: this.periodo,
    });
  }
}
