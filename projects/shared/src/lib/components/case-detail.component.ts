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
import { EstadoConsultaComponent } from '../../../../expert/src/app/shared/components/estado-consulta.component';
import { CaseDto } from '@shared/models/case/query/case.dto';
import { CaseActivityListComponent } from './case-activity-list.component';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'case-detail',
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
    EstadoConsultaComponent,
    CaseActivityListComponent,
    TableModule,
    TabsModule,
    BadgeModule,
  ],
  templateUrl: './case-detail.component.html',
  providers: [ConfirmationService],
})
export class CaseDetailComponent {
  case = input.required<CaseDto>();
}
