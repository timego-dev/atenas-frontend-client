import { Component, inject, input } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

@Component({
  selector: 'lib-date-time',
  standalone: true,
  imports: [DialogModule, ButtonModule, PanelModule, TooltipModule],
  template: `<button
    link
    [text]="true"
    pButton
    onclick="click()"
    class="!p-0"
    link
    [pTooltip]="tooltip"
  >
    {{ text }}
  </button>`,
})
export class DateTimeComponent {
  dateTime = input.required<Date | undefined | null>();

  get text() {
    if (this.dateTime()) return dayjs(this.dateTime()).fromNow();
    else return '';
  }

  get tooltip() {
    if (this.dateTime()) return dayjs(this.dateTime()).format('DD-MM-YYYY HH:mm:ss');
    else return '';
  }

  click() {}
}
