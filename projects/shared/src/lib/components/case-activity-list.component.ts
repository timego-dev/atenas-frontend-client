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
    CardModule,
    DateTimeComponent,
    ImageModule,
    EstadoConsultaComponent,
  ],
  template: `
    <div class="flex flex-col gap-4">
      @for (activity of case().activities; track $index) {
      <p-card [class]="activity.type == ActivityType.CONSULTATION ? '' : 'ml-8'">
        <div class="flex flex-row gap-6">
          <div class="mr-auto text-nowrap">
            <div class="flex flex-row gap-4">
              <span class="material-symbols-outlined text-3xl">{{
                iconPerson(activity.type)
              }}</span>

              <div class="flex flex-col gap-1">
                <div>
                  <strong>{{ activity.creator?.username }}</strong>
                </div>
                <div>
                  {{ typeActivityDisplay(activity.type) }} -
                  <lib-date-time [dateTime]="activity.creationDate" />
                </div>
                @if (activity.type == ActivityType.RESOLUTION) {
                <lib-estado-consulta [consulta]="case()" />

                }
              </div>
            </div>
          </div>

          <div>
            @if (activity.type == ActivityType.CONSULTATION) { @if ($index > 1) {
            <div><p-image class="h-[64px]" src="facial.jpg" [preview]="true" /></div>

            <audio controls="" class="!h-15"><source type="audio/mp3" src="audio.mp3" /></audio>

            } @else {
            <div><p-image class="h-[64px]" src="descarga.jpg" [preview]="true" /></div>

            } }

            <!--
            @for (attachment of activity.consultation?.attachments; track $index) {
            <div>{{ attachment.attachmentType }}</div>

            @if (attachment.digitalAttachment?.digitalAttachmentType == DigitalAttachmentType.PHOTO)
            {
            <div><p-image class="h-[64px]" src="descarga.jpg" [preview]="true" /></div>
            } @else if (attachment.digitalAttachment?.digitalAttachmentType ==
            DigitalAttachmentType.FACIAL) {
            <div><p-image class="h-[64px]" src="facial.jpg" [preview]="true" /></div>
            } @else if (attachment.digitalAttachment?.digitalAttachmentType ==
            DigitalAttachmentType.GENERIC) {
            <div><p-image class="h-[64px]" src="facial.jpg" [preview]="true" /></div>
            } }-->
          </div>
        </div>
      </p-card>
      }
    </div>
  `,
  providers: [ConfirmationService],
})
export class CaseActivityListComponent {
  case = input.required<CaseDto>();
  AttachmentType = AttachmentType;
  ActivityType = ActivityType;
  DigitalAttachmentType = DigitalAttachmentType;

  iconPerson(activityType: ActivityType) {
    switch (activityType) {
      case ActivityType.CONSULTATION:
        return 'person';
      case ActivityType.RESOLUTION:
        return 'person_check';
      case ActivityType.DOCUMENT_VERIFICATION_AUTOMATIC:
        return 'searchcheck_2';
      case ActivityType.FACE_VERIFICATION_AUTOMATIC:
        return 'ar_on_you';
    }
  }

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
