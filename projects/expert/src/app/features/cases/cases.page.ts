import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CaseFilters, CaseService, DateRangeFilter } from './case.service';

import { TiempoEntrada } from '../../shared/components/tiempo-entrada.component';
import { TiempoRespuesta } from '../../shared/components/tiempo-respuesta.component';
import { EstadoConsultaComponent } from '../../shared/components/estado-consulta.component';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';

import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { CaseResolution, CaseStatus } from '@shared/models/case/case.enums';
import { AthenasMessage, CaseCreateComponent } from '@shared/components/case-create.component';
import { CaseDetailComponent } from '@shared/components/case-detail.component';

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
    CaseDetailComponent,
    CaseCreateComponent,
  ],
  templateUrl: './cases.page.html',
  providers: [],
})
export class ConsultasPage {
  protected editDialog: boolean = false;
  protected createCaseDialog: boolean = false;

  protected case!: CaseDto;
  protected athenasMessage!: AthenasMessage;

  private readonly caseService = inject(CaseService);

  protected caseList: CaseSummaryDto[] = [];
  protected caseFilter: CaseFilters = <CaseFilters>{};

  private readonly ref = inject(ChangeDetectorRef);

  constructor() {
    this.caseService.caseList.subscribe((list) => {
      this.caseList = list;
    });
    setInterval(() => this.ref.detectChanges(), 1000);
  }

  caseStatusAvailables = [
    { label: 'Pendientes', value: CaseStatus.PENDING },
    { label: 'En curso', value: CaseStatus.OPEN },
    { label: 'Resueltas', value: CaseStatus.SOLVED },
    { label: 'Pendientes de aclaración', value: CaseStatus.CLARIFICATION_PENDING },
    { label: 'Archivadas', value: CaseStatus.ARCHIVED },
  ];

  caseResolutionAvailables = [
    { label: 'Pendientes', value: CaseResolution.PENDING },
    { label: 'Sin evidencias de falsificación', value: CaseResolution.WITHOUT_EVIDENCES },
    { label: 'Con evidencias de falsificación', value: CaseResolution.WITH_EVIDENCES },
    { label: 'Con mala calidad', value: CaseResolution.INSUFFICIENT_QUALITY },
    { label: 'Documento no válido', value: CaseResolution.INVALID_DOCUMENT },
  ];

  periodos = [
    { label: 'Hoy', value: DateRangeFilter.TODAY },
    { label: 'Esta semana', value: DateRangeFilter.THIS_WEEK },
    { label: 'Este mes', value: DateRangeFilter.THIS_MONTH },
    { label: 'Este año', value: DateRangeFilter.THIS_YEAR },
  ];

  cols: Column[] = [
    { field: 'trackingNumber', header: 'Referencia' },
    { field: 'entrada', header: 'Entrada' },
    { field: 'origen', header: 'Origen' },
    { field: 'price', header: 'Tiempo respuesta' },
    { field: 'operador', header: 'Operador' },
    { field: 'estado', header: 'Estado' },
  ];

  filterChange(event: SelectChangeEvent) {
    this.caseService.applyFilter(this.caseFilter);
  }

  hideDialog() {
    this.editDialog = false;
  }

  clickCaseDetail(consulta: CaseSummaryDto) {
    this.caseService.getById(consulta.id).subscribe((data) => {
      this.case = data;
      this.editDialog = true;
    });
  }

  clickCaseCreate() {
    this.athenasMessage = <AthenasMessage>{};

    this.createCaseDialog = true;
  }

  saveDetail() {}

  saveCreate() {
    this.caseService
      .createCase(this.athenasMessage.athenasMessageDto, this.athenasMessage.files)
      .subscribe({
        next: (data) => {
          this.createCaseDialog = false;
        },
        error: (err) => {
          console.error('Error creating case', err);
        },
      });
  }
}
