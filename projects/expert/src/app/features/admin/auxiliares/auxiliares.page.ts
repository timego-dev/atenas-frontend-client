import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FieldType, GetAuxiliar } from '@shared/models/auxiliar/query/get-auxiliar-response.model';
import { AuxiliaresService } from './auxiliares.service';
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
import { PostAuxiliar } from '@shared/models/auxiliar/command/post-auxiliar-request.model';
import { AuxiliaresEditComponent } from './auxiliares-edit.component';
import { AuxiliarValidator } from '@shared/services/mock/auxiliar-repository-mock.service';

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
  providers: [MessageService, AuxiliaresService, ConfirmationService],
})
export class AuxiliaresPage implements OnInit {
  auxiliares = signal<GetAuxiliar[]>([]);
  auxiliar: Partial<GetAuxiliar> = {};
  editDialog = false;
  submitted = false;
  @ViewChild('dt') table!: Table;
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

  ngOnInit(): void {
    this.loadAuxiliares();
  }

  loadAuxiliares() {
    this.auxiliarService.getAuxiliares().subscribe({
      next: (data) => {
        this.auxiliares.set(data);
      },
      error: (error) => this.handlingErrorMessage(error?.error),
    });
  }

  onGlobalFilter(event: Event) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.auxiliar = { options: [] };
    this.submitted = false;
    this.editDialog = true;
  }

  editAuxiliar(auxiliar: GetAuxiliar) {
    this.auxiliar = { ...auxiliar };
    this.editDialog = true;
  }

  deleteAuxiliar(auxiliar: GetAuxiliar) {
    this.hideDialog();
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar ${auxiliar.title}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.auxiliarService.delete(auxiliar.id).subscribe({
          next: () => {
            this.auxiliar = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Correcto',
              detail: 'Campo auxiliar eliminado',
              life: 3000,
            });
            this.auxiliares.update((list) => list.filter((a) => a.id !== auxiliar.id));
          },
          error: (error) => this.handlingErrorMessage(error?.error),
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

    if (AuxiliarValidator.validate(this.auxiliar as PostAuxiliar).length > 0) {
      return;
    }

    if (this.auxiliar.id) {
      this.auxiliarService.update(this.auxiliar.id, this.auxiliar as PostAuxiliar).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: data ? 'success' : 'error',
            summary: data ? 'Correcto' : 'Error',
            detail: data ? 'Campo auxiliar actualizado' : 'Campo auxiliar no encontrado',
            life: 3000,
          });
          if (data) {
            this.loadAuxiliares();
          }
        },
        error: (error) => this.handlingErrorMessage(error?.error),
      });
    } else {
      this.auxiliarService.create(this.auxiliar as PostAuxiliar).subscribe({
        next: (_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Campo auxiliar creado',
            life: 3000,
          });
          this.loadAuxiliares();
        },
        error: (error) => this.handlingErrorMessage(error?.error),
      });
    }

    this.editDialog = false;
    this.auxiliar = {};
  }

  hideDialog() {
    this.editDialog = false;
    this.submitted = false;
  }

  private handlingErrorMessage(errors: string[] | undefined): void {
    let errorMessage = 'Error Interno del Servidor';
    if (errors && errors.length > 0) {
      errorMessage = errors.join(', ');
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000,
    });
  }
}
