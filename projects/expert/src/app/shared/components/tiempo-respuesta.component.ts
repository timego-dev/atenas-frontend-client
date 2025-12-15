import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import dayjs from 'dayjs';
import { CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'lib-tiempo-respuesta',
  imports: [TagModule, Tooltip],
  template: ` @if (consulta().lastResolution) {
    <p-tag [severity]="severityColor()" [value]="value()" [pTooltip]="tooltip" />
    }`,
})
export class TiempoRespuesta {
  consulta = input.required<CaseSummaryDto>();

  severityColor() {
    const diff =
      dayjs(this.consulta().lastResolution).diff(dayjs(this.consulta().creationDate)) / 1000;

    return diff > 60 * 3 ? 'danger' : 'success';
  }

  value() {
    return dayjs(this.consulta().lastResolution).from(dayjs(this.consulta().creationDate));
  }

  get tooltip() {
    return dayjs(this.consulta().lastResolution).format('DD-MM-YYYY HH:mm:ss');
  }
}
