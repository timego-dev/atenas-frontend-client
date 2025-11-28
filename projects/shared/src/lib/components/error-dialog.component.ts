import { Component, inject } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ErrorDialogModel, ErrorDialogService } from '@shared/services/error-dialog.service';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, PanelModule],
  template: `
    <p-dialog [header]="model?.title" [modal]="true" [(visible)]="visible" [closeOnEscape]="false">
      @if (Array.isArray(model?.text)) { @for (item of model?.text; track $index) {
      <p>{{ item }}</p>
      } } @if (isString(model?.text)) {
      <p>{{ model?.text }}</p>
      } @if (model?.detail) {
      <p-panel class="m-2" header="Más detalles" [toggleable]="true" collapsed="true">
        @if (Array.isArray(model?.detail)) { @for (item of model?.detail; track $index) {
        <p>{{ item }}</p>
        } } @else {
        <p>{{ model?.detail }}</p>
        }
      </p-panel>
      }

      <div class="flex justify-content-end gap-2 mt-4">
        @if (model?.tryAgain) {
        <p-button label="Reintentar" severity="secondary" (click)="reintentar()" />
        }
        <p-button label="Cerrar" (click)="visible = false" />
      </div>
    </p-dialog>
  `,
})
export class ErrorDialogComponent {
  Array = Array;
  visible = false;
  model?: ErrorDialogModel;

  private readonly errorDialogService = inject(ErrorDialogService);

  constructor() {
    this.errorDialogService.requests$.subscribe((model) => {
      this.model = model;
      this.visible = true;
    });
  }

  close() {
    this.visible = false;
  }

  async reintentar() {
    this.visible = false;
    await this.model?.tryAgain?.();
  }

  protected isString(value: any): boolean {
    return typeof value === 'string';
  }
}
