import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { GetAuxiliar } from '@shared/models/auxiliar/query/get-auxiliar-response.model';
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
import { AuxiliarEditComponent } from './auxiliar-edit.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import {
  FieldType,
  PostAuxiliar,
} from '@shared/models/auxiliar/command/post-auxiliar-request.model';

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
    AuxiliarEditComponent,
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
      field: 'creationDate',
      header: 'Fecha de creación',
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
    this.auxiliarService.getAuxiliares().subscribe((data) => {
      this.auxiliares.set(data);
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
        this.auxiliarService.delete(auxiliar.id).subscribe(() => {
          this.auxiliar = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Usuario eliminado',
            life: 3000,
          });
          this.auxiliares.update((list) => list.filter((a) => a.id !== auxiliar.id));
        });
      },
    });
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

    if (
      !this.auxiliar.alias ||
      !this.auxiliar.title ||
      !this.auxiliar.type ||
      !this.auxiliar.creationDate
    ) {
      return;
    }

    if (this.auxiliar.id) {
      this.auxiliarService
        .update(this.auxiliar.id, this.auxiliar as PostAuxiliar)
        .subscribe((data) => {
          this.messageService.add({
            severity: data ? 'success' : 'error',
            summary: data ? 'Correcto' : 'Error',
            detail: data ? 'Auxiliar actualizado' : 'Auxiliar no encontrado',
            life: 3000,
          });
          if (data) {
            this.loadAuxiliares();
          }
        });
    } else {
      this.auxiliarService.create(this.auxiliar as PostAuxiliar).subscribe((_) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Auxiliar creado',
          life: 3000,
        });
        this.loadAuxiliares();
      });
    }

    this.editDialog = false;
    this.auxiliar = {};
  }

  hideDialog() {
    this.editDialog = false;
    this.submitted = false;
  }
}
