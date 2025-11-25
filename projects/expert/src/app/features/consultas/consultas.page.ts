import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConsultasService, FiltroPeriodo } from './consultas.service';

import { TiempoEntrada } from '../../shared/components/tiempo-entrada.component';
import { TiempoRespuesta } from '../../shared/components/tiempo-respuesta.component';
import { EstadoConsultaComponent } from '../../shared/components/estado-consulta.component';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';

import { ConsultaEditComponent } from './consulta-edit.component';
import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { CaseResolution, CaseStatus } from '@shared/models/shared.enums';

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
    DialogModule,
    ConsultaEditComponent,
  ],
  templateUrl: './consultas.page.html',
  providers: [],
})
export class ConsultasPage {
  protected editDialog: boolean = false;
  protected consulta!: CaseDto;

  private readonly consultasService = inject(ConsultasService);

  protected consultas: CaseSummaryDto[] = [];
  private readonly ref = inject(ChangeDetectorRef);

  constructor() {
    this.consultasService.consultasFiltradas$.subscribe((data) => {
      this.consultas = data;
    });
    setInterval(() => this.ref.detectChanges(), 1000);
  }

  estados = [
    { label: 'Pendientes', value: CaseStatus.PENDING },
    { label: 'En curso', value: CaseStatus.OPEN },
    { label: 'Resueltas', value: CaseStatus.SOLVED },
    { label: 'Pendientes de aclaración', value: CaseStatus.CLARIFICATION_PENDING },
    { label: 'Archivadas', value: CaseStatus.ARCHIVED },
  ];

  estado = <CaseStatus[]>[];

  respuestas = [
    { label: 'Pendientes', value: CaseResolution.PENDING },
    { label: 'Sin evidencias de falsificación', value: CaseResolution.WITHOUT_EVIDENCES },
    { label: 'Con evidencias de falsificación', value: CaseResolution.WITH_EVIDENCES },
    { label: 'Con mala calidad', value: CaseResolution.INSUFFICIENT_QUALITY },
    { label: 'Documento no válido', value: CaseResolution.INVALID_DOCUMENT },
  ];

  respuesta = <CaseResolution[]>[];

  periodos = [
    { label: 'Hoy', value: FiltroPeriodo.HOY },
    { label: 'Esta semana', value: FiltroPeriodo.ESTA_SEMANA },
    { label: 'Este mes', value: FiltroPeriodo.ESTE_MES },
    { label: 'Este año', value: FiltroPeriodo.ESTE_AÑO },
  ];

  periodo = <FiltroPeriodo | undefined>undefined;

  cols: Column[] = [
    { field: 'trackingNumber', header: 'Referencia' },
    { field: 'entrada', header: 'Entrada' },
    { field: 'origen', header: 'Origen' },
    { field: 'price', header: 'Tiempo respuesta' },
    { field: 'operador', header: 'Operador' },
    { field: 'estado', header: 'Estado' },
  ];

  filterChange(event: SelectChangeEvent) {
    this.consultasService.applyFilter({
      estado: this.estado,
      respuesta: this.respuesta,
      periodo: this.periodo,
    });
  }

  hideDialog() {
    this.editDialog = false;
  }

  editConsulta(consulta: CaseSummaryDto) {
    this.consultasService.getById(consulta.id).subscribe((data) => {
      this.consulta = data;
      this.editDialog = true;
    });
  }

  guardar() {}
}
