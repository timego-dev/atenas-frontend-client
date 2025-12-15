import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { AuxiliaresService } from './auxiliares.service';
import { UiSafeCallerService } from '@shared/services/ui-safe-caller.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { AuxiliaresEditComponent } from './auxiliares-edit.component';
import { AuxiliarValidator } from '@shared/services/mock/auxiliar-repository-mock.service';
import {
  AuxiliarResponseDto,
  createEmptyAuxiliarRequest,
  FieldType,
} from '@shared/models/auxiliar/query/auxiliar-response.model';
import { AuxiliarRequestDto } from '@shared/models/auxiliar/command/auxiliar-request.model';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'page-auxiliares',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    InputNumberModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    AuxiliaresEditComponent,
  ],
  templateUrl: './auxiliares.page.html',
  providers: [AuxiliaresService, ConfirmationService],
})
export class AuxiliaresPage implements OnInit {
  editDialogComponent = viewChild<AuxiliaresEditComponent>('editDialogComponent');
  auxiliares = signal<AuxiliarResponseDto[]>([]);
  selectedAuxiliar: AuxiliarResponseDto | null = null;
  editingAuxiliar: AuxiliarRequestDto | null = createEmptyAuxiliarRequest();
  editDialogVisible = false;
  submitted = false;
  table = viewChild<Table>('dt');

  cols: Column[] = [
    {
      field: 'alias',
      header: 'Alias',
    },
    {
      field: 'title',
      header: 'Título',
    },
    {
      field: 'type',
      header: 'Tipo',
    },
    {
      field: 'required',
      header: 'Requerido',
    },
  ];

  protected readonly auxiliarService = inject(AuxiliaresService);
  protected readonly messageService = inject(MessageService);
  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly uiSafeCallerService = inject(UiSafeCallerService);

  ngOnInit(): void {
    this.loadAuxiliares();
  }

  loadAuxiliares() {
    this.uiSafeCallerService
      .callWithErrorHandling('Cargar auxiliares', () => this.auxiliarService.getAuxiliares())
      .subscribe({
        next: (data) => this.auxiliares.set(data),
      });
  }

  onGlobalFilter(event: Event) {
    this.table()?.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.selectedAuxiliar = null;
    this.editingAuxiliar = createEmptyAuxiliarRequest();
    this.submitted = false;
    this.editDialogVisible = true;
  }

  editAuxiliar(auxiliar: AuxiliarResponseDto) {
    this.selectedAuxiliar = auxiliar;
    this.editingAuxiliar = {
      ...auxiliar,
      minValue: auxiliar.minValue ?? undefined,
      maxValue: auxiliar.maxValue ?? undefined,
      decimals: auxiliar.decimals ?? undefined,
      maxLength: auxiliar.maxLength ?? undefined,
      options: auxiliar.options?.map((opt) => ({ ...opt })),
    };
    this.editDialogVisible = true;
  }

  deleteAuxiliar(auxiliar: AuxiliarResponseDto) {
    this.hideDialog();

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar ${auxiliar.title}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.uiSafeCallerService
          .callWithErrorHandling('Eliminar auxiliar', () =>
            this.auxiliarService.delete(auxiliar.id)
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Correcto',
                detail: 'Campo auxiliar eliminado',
                life: 3000,
              });

              this.auxiliares.update((list) => list.filter((a) => a.id !== auxiliar.id));
            },
          });
      },
    });
  }

  translateFieldType(type: FieldType): string {
    switch (type) {
      case FieldType.CurrencyEuro:
        return 'Moneda Euro';
      case FieldType.Integer:
        return 'Número entero';
      case FieldType.Numeric:
        return 'Número decimal';
      case FieldType.Text:
        return 'Texto';
      case FieldType.List:
        return 'Lista';
      default:
        return '';
    }
  }

  getTypeColor(type: FieldType) {
    switch (type) {
      case FieldType.CurrencyEuro:
        return 'success';
      case FieldType.Integer:
        return 'warn';
      case FieldType.Numeric:
        return 'danger';
      case FieldType.Text:
        return 'secondary';
      case FieldType.List:
        return 'contrast';
      default:
        return 'info';
    }
  }

  guardar(): void {
    this.submitted = true;

    if (AuxiliarValidator.validate(this.editingAuxiliar as AuxiliarRequestDto).length > 0) {
      return;
    }

    const isUpdating = !!this.selectedAuxiliar?.id;

    const actionName = isUpdating ? 'Actualizar auxiliar' : 'Crear auxiliar';

    const operation$ = isUpdating
      ? this.auxiliarService.update(
          this.selectedAuxiliar?.id!,
          this.editingAuxiliar as AuxiliarRequestDto
        )
      : this.auxiliarService.create(this.editingAuxiliar as AuxiliarRequestDto);

    this.uiSafeCallerService
      .callWithErrorHandling(actionName, () => operation$)
      .subscribe({
        next: (_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: isUpdating ? 'Campo auxiliar actualizado' : 'Campo auxiliar creado',
            life: 3000,
          });

          this.loadAuxiliares();
        },
      });

    this.editDialogVisible = false;
    this.selectedAuxiliar = null;
    this.editingAuxiliar = createEmptyAuxiliarRequest();
  }

  hideDialog() {
    this.editDialogVisible = false;
    this.submitted = false;
  }
}
