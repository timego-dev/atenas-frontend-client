import { Component, input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
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
import { CaseDto } from '@shared/models/case/query/case.dto';
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
    ImageModule,
    TableModule,
  ],
  template: `
    <div class="flex flex-row gap-1 items-center">
      <i class="pi pi-exclamation-triangle !text-xl text-red-500 "></i>
      <button (click)="clickAlertDetail()" class="p-button p-button-text">
        DNIe entre los años 2000 y 2002 con Lugar de Nacimiento León
      </button>
    </div>
  `,
  providers: [ConfirmationService],
})
export class CaseAlertasListComponent {
  case = input.required<CaseDto>();

  clickAlertDetail() {}
}
