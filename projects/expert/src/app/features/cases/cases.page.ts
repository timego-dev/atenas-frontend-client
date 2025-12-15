import { ChangeDetectorRef, Component, inject, viewChild, ViewEncapsulation } from '@angular/core';

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
import { Dialog, DialogModule } from 'primeng/dialog';

import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { CaseResolution, CaseStatus } from '@shared/models/case/case.enums';
import { AthenasMessage, CaseCreateComponent } from '@shared/components/case-create.component';
import { CaseDetailComponent } from '@shared/components/case-detail.component';

import { UiSafeCallerService } from '@shared/services/ui-safe-caller.service';
import { ToastModule } from 'primeng/toast';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'cases-page',
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
    ToastModule,
  ],
  templateUrl: './cases.page.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .p-dialog {
        border-radius: var(--p-overlay-modal-border-radius); /* o el que facis servir */
        background: var(--surface-ground) !important;
      }

      .p-dialog-header,
      .p-dialog-content,
      .p-dialog-footer {
        background: var(--surface-ground) !important;
        border-radius: inherit;
      }

      .p-tablist,
      .p-tabpanels {
        background: none !important;
      }

      .p-tabpanels {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .material-symbols-outlined {
        font-variation-settings: 'opsz' 48;
      }
    `,
  ],
  providers: [],
})
export class CasesPage {
  editDialogComponent = viewChild<Dialog>('editDialogComponent');
  createDialogComponent = viewChild<Dialog>('createDialogComponent');

  editDialog: boolean = false;
  createCaseDialog: boolean = false;
  case?: CaseDto;
  athenasMessage!: AthenasMessage;
  caseList: CaseSummaryDto[] = [];
  caseFilter: CaseFilters = <CaseFilters>{};

  private readonly caseService = inject(CaseService);
  private readonly ref = inject(ChangeDetectorRef);
  private readonly uiSafeCallerService = inject(UiSafeCallerService);

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

  saveCreate() {
    this.uiSafeCallerService
      .callWithErrorHandling('Creación de nuevo caso', () =>
        this.caseService.createCase(
          this.athenasMessage.athenasMessageDto,
          this.athenasMessage.files
        )
      )
      .subscribe({
        next: (data) => {
          this.createCaseDialog = false;
        },
      });
  }
}
