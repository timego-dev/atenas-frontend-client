import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import dayjs from 'dayjs';
import { CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { CaseStatus } from '@shared/models/case/case.enums';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'lib-tiempo-entrada',
  imports: [TagModule, Tooltip],
  template: ` <p-tag [severity]="severityColor()" [value]="value()" [pTooltip]="tooltip" /> `,
})
export class TiempoEntrada {
  consulta = input.required<CaseSummaryDto>();

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

  get tooltip() {
    return dayjs(this.consulta().creationDate).format('DD-MM-YYYY HH:mm:ss');
  }
}
