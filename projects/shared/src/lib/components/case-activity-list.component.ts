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
import { ActivityType, AttachmentType } from '@shared/models/case/case.enums';

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
    <p-panel>
      <i class="pi pi-user"></i>
      <div>{{ activity.creator?.username }}</div>
      <div>{{ activity.creationDate | date : 'dd/MM/yyyy HH:mm:ss' }}</div>
      <div>{{ typeActivityDisplay(activity.type) }}</div>

      <div>Adjuntos:</div>
      @for (attachment of activity.consultation?.attachments; track $index) {
      <div>{{ attachment.name }}</div>
      <div>{{ attachment.attachmentType }}</div>
      @if (attachment.attachmentType == AttachmentType.DOCUMENT_DV) {
      <div>{{ attachment.documentDvAttachment?.scannerDvData?.chip }}</div>
      } }
    </p-panel>
    }
  `,
  providers: [ConfirmationService],
})
export class CaseActivityListComponent {
  case = input.required<CaseDto>();
  AttachmentType = AttachmentType;

  typeActivityDisplay(type: ActivityType) {
    switch (type) {
      case ActivityType.CONSULTATION:
        return 'Envío consulta';
      case ActivityType.DOCUMENT_VERIFICATION_AUTOMATIC:
        return 'Verificación automática de documento';
      case ActivityType.RESOLUTION:
        return 'Resolución';
      case ActivityType.FACE_VERIFICATION_AUTOMATIC:
        return 'Verificación autmática facial';
    }
  }
}
