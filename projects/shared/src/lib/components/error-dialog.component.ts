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
      <div class="gap-8 flex mt-2 mb-8">
        <i class="pi pi-exclamation-triangle !text-6xl text-red-500"></i>

        <div style="flex: 1">
          @if (Array.isArray(model?.text)) { @for (item of model?.text; track $index) {
          <h5>{{ item }}</h5>
          } } @if (isString(model?.text)) {
          <h5>{{ model?.text }}</h5>
          } @if (model?.detail) {
          <p-panel header="Más detalles" [toggleable]="true" collapsed="true">
            @if (Array.isArray(model?.detail)) { @for (item of model?.detail; track $index) {
            <p>{{ item }}</p>
            } } @else {
            <p>{{ model?.detail }}</p>
            }
          </p-panel>
          }
        </div>
      </div>

      <div class="flex gap-4 justify-end">
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
