import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  template: `<div class="layout-footer">
    Atenas {{ projectName }} by
    <a
      href="https://bioidenti.com"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary font-bold hover:underline"
      >Bioidenti</a
    >
  </div>`,
})
export class AppFooter {
  @Input() projectName: string = '';
}
