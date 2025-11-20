import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import dayjs from 'dayjs';
import { CaseStatus, IConsulta } from '../../features/consultas/consultas.service';

@Component({
  selector: 'lib-tiempo-entrada',
  imports: [TagModule],
  template: ` <p-tag [severity]="severityColor()" [value]="value()" /> `,
})
export class TiempoEntrada {
  consulta = input.required<IConsulta>();

  severityColor() {
    if (
      this.consulta().caseStatus == CaseStatus.SOLVED ||
      this.consulta().caseStatus == CaseStatus.ARCHIVED
    )
      return 'secondary';

    const diff = dayjs().diff(dayjs(this.consulta().creationDate)) / 1000;

    if (diff >= 60 * 3) return 'danger';
    else if (diff >= 60 * 2) return 'warn';

    return 'success';
  }

  value() {
    return dayjs(this.consulta().creationDate).fromNow();
  }
}
