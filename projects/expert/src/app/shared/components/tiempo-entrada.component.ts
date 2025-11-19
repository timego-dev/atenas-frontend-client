import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import dayjs from 'dayjs';
import { EstadoConsulta, IConsulta } from '../../features/consultas/consultas.service';

@Component({
  selector: 'lib-tiempo-entrada',
  imports: [TagModule],
  template: ` <p-tag [severity]="severityColor()" [value]="value()" /> `,
})
export class TiempoEntrada {
  consulta = input.required<IConsulta>();

  severityColor() {
    if (
      this.consulta().estado == EstadoConsulta.RESUELTA ||
      this.consulta().estado == EstadoConsulta.ARCHIVADA
    )
      return 'secondary';

    const diff = dayjs().diff(dayjs(this.consulta().fechaEntrada)) / 1000;

    if (diff >= 60 * 3) return 'danger';
    else if (diff >= 60 * 2) return 'warn';

    return 'success';
  }

  value() {
    return dayjs(this.consulta().fechaEntrada).fromNow();
  }
}
