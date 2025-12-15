import { Component, input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { EstadoConsultaComponent } from '../../../../expert/src/app/shared/components/estado-consulta.component';
import { CaseDto } from '@shared/models/case/query/case.dto';
import {
  ActivityType,
  AttachmentType,
  DigitalAttachmentType,
} from '@shared/models/case/case.enums';
import { DateTimeComponent } from './date-time.component';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { AlertSummaryDto } from '@shared/models/case/query/auxiliar-alert.dto';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'case-alerts-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    IconFieldModule,
    ToggleSwitchModule,
    PanelModule,
    CardModule,
    DateTimeComponent,
    ImageModule,
    EstadoConsultaComponent,
    TableModule,
  ],
  template: `
    <p-table
      [value]="case().alerts || []"
      [rows]="10"
      [columns]="cols"
      [paginator]="true"
      [rowHover]="false"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} alertas"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
    >
      <ng-template #caption>
        <nav style="display: flex; align-items: center">
          <div style="margin-right: auto">
            <h2 style="margin: 0">Alertas</h2>
          </div>
        </nav>
      </ng-template>

      <ng-template #header>
        <tr>
          <th style="min-width: 4rem">Nombre</th>
        </tr>
      </ng-template>

      <ng-template #body let-alert>
        <tr>
          <td style="min-width: 12rem">
            <button (click)="clickAlertDetail(alert)" class="p-button p-button-text">
              {{ alert.name }}
            </button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  providers: [ConfirmationService],
})
export class CaseAlertasListComponent {
  case = input.required<CaseDto>();

  cols: Column[] = [{ field: 'name', header: 'Nombre' }];

  clickAlertDetail(alert: AlertSummaryDto) {}
}
