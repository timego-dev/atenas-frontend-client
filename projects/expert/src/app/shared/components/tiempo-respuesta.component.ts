import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import dayjs from 'dayjs';
import { CaseSummaryDto } from '@shared/models/case/query/case.dto';

@Component({
  selector: 'lib-tiempo-respuesta',
  imports: [TagModule],
  template: ` @if (consulta().lastConsultation) {
    <p-tag [severity]="severityColor()" [value]="value()" />
    }`,
})
export class TiempoRespuesta {
  consulta = input.required<CaseSummaryDto>();

  severityColor() {
    const diff =
      dayjs(this.consulta().lastConsultation).diff(dayjs(this.consulta().creationDate)) / 1000;

    return diff > 60 * 3 ? 'danger' : 'success';
  }

  value() {
    return dayjs(this.consulta().lastConsultation).from(dayjs(this.consulta().creationDate));
  }
}
