import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AlertRequestDto } from '@shared/models/alert/command/alert-request.model';
import { AlertResponseDto } from '@shared/models/alert/query/alert-response.model';
import { AlertasService } from './alertas.service';
import { UiSafeCallerService } from '@shared/services/ui-safe-caller.service';
import { AlertasEditComponent } from './alertas-edit.component';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'page-alertas',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    AlertasEditComponent,
  ],
  templateUrl: './alertas.page.html',
  providers: [AlertasService, ConfirmationService],
})
export class AlertasPage implements OnInit {
  alertas = signal<AlertResponseDto[]>([]);
  selectedAlerta: AlertResponseDto | null = null;
  editingAlerta: AlertRequestDto = new AlertRequestDto();
  editDialog = false;
  submitted = false;

  table = viewChild<Table>('dt');

  cols: Column[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'active', header: 'Activo' },
    { field: 'lastModifiedAt', header: 'Última modificación' },
  ];

  protected readonly alertasService = inject(AlertasService);
  protected readonly messageService = inject(MessageService);
  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly uiSafeCallerService = inject(UiSafeCallerService);

  ngOnInit(): void {
    this.loadAlertas();
  }

  loadAlertas() {
    this.uiSafeCallerService
      .callWithErrorHandling('Cargar alertas', () => this.alertasService.getAlertas())
      .subscribe({
        next: (data) => {
          this.alertas.set(data);
        },
      });
  }

  onGlobalFilter(event: Event) {
    this.table()?.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.selectedAlerta = null;

    // Initialize with empty alert and default rule group
    this.editingAlerta = new AlertRequestDto();

    this.submitted = false;
    this.editDialog = true;
  }

  editAlerta(alerta: AlertResponseDto) {
    this.selectedAlerta = new AlertResponseDto(alerta);
    this.editingAlerta = this.alertasService.deserializeAlert(alerta);

    this.submitted = false;
    this.editDialog = true;
  }

  hideDialog() {
    this.editDialog = false;
    this.submitted = false;
  }

  guardar() {
    this.submitted = true;
    if (!this.editingAlerta) {
      return;
    }

    if (!this.validateAlerta(this.editingAlerta)) {
      return;
    }

    const alertRequest: AlertRequestDto = new AlertRequestDto(this.editingAlerta);

    // Create or update
    if (this.selectedAlerta?.id) {
      this.updateAlerta(this.selectedAlerta.id, alertRequest);
    } else {
      this.createAlerta(alertRequest);
    }
  }

  private createAlerta(alerta: AlertRequestDto) {
    this.uiSafeCallerService
      .callWithErrorHandling('Crear alerta', () => this.alertasService.create(alerta))
      .subscribe({
        next: (_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Alerta creada correctamente',
          });
          this.loadAlertas();
          this.hideDialog();
        },
      });
  }

  private updateAlerta(id: string, alerta: AlertRequestDto) {
    this.uiSafeCallerService
      .callWithErrorHandling('Actualizar alerta', () => this.alertasService.update(id, alerta))
      .subscribe({
        next: (_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Alerta actualizada correctamente',
          });
          this.loadAlertas();
          this.hideDialog();
        },
      });
  }

  deleteAlerta(alerta: AlertResponseDto) {
    this.hideDialog();
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la alerta "${alerta.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.uiSafeCallerService
          .callWithErrorHandling('Eliminar alerta', () => this.alertasService.delete(alerta.id))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Alerta eliminada correctamente',
              });
              this.loadAlertas();
            },
          });
      },
    });
  }

  private validateAlerta(alerta: AlertRequestDto): boolean {
    // Validate required fields
    if (!alerta.name?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El nombre es obligatorio',
      });
      return false;
    }

    // Validate rule group
    if (alerta.ruleGroup) {
      const validation = this.alertasService.validateRuleGroup(alerta.ruleGroup);
      if (!validation.valid) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validación de reglas',
          detail: validation.errors.join('\n'),
          life: 5000,
        });
        return false;
      }
    }

    return true;
  }

  /**
   * Get severity for status tag
   */
  getSeverity(active: boolean): 'success' | 'danger' {
    return active ? 'success' : 'danger';
  }

  /**
   * Get label for status tag
   */
  getStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }
}
