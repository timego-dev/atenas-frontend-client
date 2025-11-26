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
import { EstadoConsultaComponent } from '../../shared/components/estado-consulta.component';
import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';

@Component({
  selector: 'edit-consulta',
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
  ],
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2">
        <p-panel header="Consulta">
          <div class="flex flex-row gap-6">
            <div style="margin-right: auto"><strong>Consulta</strong></div>
            <div>
              {{ consulta().trackingNumber }}
            </div>
          </div>
          <div class="flex flex-row gap-6">
            <div style="margin-right: auto"><strong>Fecha entrada</strong></div>
            <div>
              {{ consulta().creationDate | date : 'dd/MM/yyyy HH:mm:ss' }}
            </div>
          </div>
          <div class="flex flex-row gap-6">
            <div style="margin-right: auto"><strong>Emisor</strong></div>
            <div>
              {{ consulta().creator.username }}
            </div>
          </div>
        </p-panel>
        <p-panel header="Respuesta">
          <div class="flex flex-row gap-6">
            <div style="margin-right: auto"><strong>Fecha respuesta</strong></div>
            <div>
              {{ consulta().lastUpdated | date : 'dd/MM/yyyy HH:mm:ss' }}
            </div>
          </div>
          <div class="flex flex-row gap-6">
            <div style="margin-right: auto"><strong>Experto</strong></div>
            <div>
              {{ consulta().expert?.username }}
            </div>
          </div>
          <div class="flex flex-row gap-6">
            <div style="margin-right: auto"><strong>Respuesta</strong></div>
            <div>
              <lib-estado-consulta [consulta]="consulta()" />
            </div>
          </div>
        </p-panel>
        <p-panel> </p-panel>
      </div>

      <p-panel header="Actividad"> </p-panel>
    </div>
  `,
  providers: [MessageService, ConfirmationService],
})
export class ConsultaEditComponent {
  consulta = input.required<CaseDto>();
}
