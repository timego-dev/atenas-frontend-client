import { Component, ElementRef, Input } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenu],
  template: ` <div class="layout-sidebar">
    <app-menu [projectName]="projectName"></app-menu>
  </div>`,
})
export class AppSidebar {
  @Input() projectName: string = '';

  constructor(public el: ElementRef) {}
}
