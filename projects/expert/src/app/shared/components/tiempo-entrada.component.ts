import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import dayjs from 'dayjs';
import { CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { CaseStatus } from '@shared/models/shared.enums';

@Component({
  selector: 'lib-tiempo-entrada',
  imports: [TagModule],
  template: ` <p-tag [severity]="severityColor()" [value]="value()" /> `,
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
}
