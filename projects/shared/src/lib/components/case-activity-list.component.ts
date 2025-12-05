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

@Component({
  selector: 'case-activity-list',
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
  ],
  template: `
    @for (activity of case().activities; track $index) {
    <div>Unidad 2</div>
    <div>Envío información adicional</div>
    <div>Hace 39 minutos</div>
    <div>Adjuntos:</div>
    @for (attachment of activity.consultation?.attachments; track $index) {
    <div>{{ attachment.name }}</div>
    }
    <hr />
    }
  `,
  providers: [ConfirmationService],
})
export class CaseActivityListComponent {
  case = input.required<CaseDto>();
}
