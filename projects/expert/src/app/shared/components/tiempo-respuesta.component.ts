import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import dayjs from 'dayjs';
import { IConsulta } from '../../features/consultas/consultas.service';

@Component({
  selector: 'lib-tiempo-respuesta',
  imports: [TagModule],
  template: ` @if (consulta().lastUpdated) {
    <p-tag [severity]="severityColor()" [value]="value()" />
    }`,
})
export class TiempoRespuesta {
  consulta = input.required<IConsulta>();

  severityColor() {
    const diff =
      dayjs(this.consulta().lastUpdated).diff(dayjs(this.consulta().creationDate)) / 1000;

    return diff > 60 * 3 ? 'danger' : 'success';
  }

  value() {
    return dayjs(this.consulta().lastUpdated).from(dayjs(this.consulta().creationDate));
  }
}
