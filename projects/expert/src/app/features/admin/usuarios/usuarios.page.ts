import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UsuarioService } from './usuarios.service';
import { IUser, Role } from '@shared/services/user-repository.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'page-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
  ],
  template: `
    <h1>Usuarios</h1>

    <p-table
      #dt
      [value]="usuarios()"
      [rows]="10"
      [columns]="cols"
      [paginator]="true"
      [globalFilterFields]="['username', 'email', 'role', 'locked']"
      [tableStyle]="{ 'min-width': '75rem' }"
      [rowHover]="true"
      dataKey="id"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
    >
      <ng-template #caption>
        <nav style="display:flex;align-items:center" role="navigation" aria-label="Barra superior">
          <div style="margin-right:auto;">
            <p-button
              label="Añadir"
              icon="pi pi-plus"
              severity="primary"
              class="mr-2"
              (onClick)="openNew()"
            />
          </div>

          <div>
            <p-iconfield>
              <p-inputicon styleClass="pi pi-search" />
              <input
                pInputText
                type="text"
                (input)="onGlobalFilter(dt, $event)"
                placeholder="Buscar..."
              />
            </p-iconfield>
          </div>
        </nav>
      </ng-template>

      <ng-template #header>
        <tr>
          <th style="min-width: 16rem">Nombre</th>
          <th style="min-width:16rem">eMail</th>
          <th>Rol</th>
          <th style="min-width: 8rem">Estado</th>
        </tr>
      </ng-template>

      <ng-template #body let-usuario>
        <tr>
          <td style="min-width: 12rem">
            <button (click)="editUser(usuario)" class="p-button p-button-text">
              {{ usuario.username }}
            </button>
          </td>
          <td style="min-width: 16rem">{{ usuario.email }}</td>
          <td style="width: 64px">
            <p-tag [value]="nombreRol(usuario.role)" [severity]="getRolColor(usuario.role)" />
          </td>
          <td>
            <p-tag
              [value]="usuario.locked ? 'Bloqueado' : 'Activo'"
              [severity]="getStatusColor(usuario.locked)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="editDialog" [style]="{ width: '450px' }" header="Usuario" [modal]="true">
      <ng-template #content>
        <div class="flex flex-col gap-6">
          <div>
            <label for="nombre" class="block font-bold mb-3">Nombre</label>
            <input
              type="text"
              pInputText
              id="nombre"
              [(ngModel)]="usuario.username"
              required
              autofocus
              fluid
            />
            <small class="text-red-500" *ngIf="submitted && !usuario.username"
              >El nombre es obligatorio</small
            >
          </div>

          <div>
            <label for="email" class="block font-bold mb-3">EMail</label>
            <input type="email" id="email" pInputText [(ngModel)]="usuario.email" required fluid />
          </div>

          <div>
            <label for="inventoryStatus" class="block font-bold mb-3">Rol</label>
            <p-select
              [(ngModel)]="usuario.role"
              inputId="inventoryStatus"
              [options]="roles"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona el rol"
              fluid
            />
          </div>
        </div>
      </ng-template>

      <ng-template #footer>
        @if (usuario.id) {
        <p-button
          severity="danger"
          label="Eliminar"
          icon="pi pi-trash"
          outlined
          (onClick)="deleteUser(usuario)"
        />
        }

        <p-button severity="secondary" label="Cancelar" icon="pi pi-times" (click)="hideDialog()" />
        <p-button label="Guardar" icon="pi pi-check" (click)="saveProduct()" />
      </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />
    <p-toast></p-toast>
  `,
  providers: [MessageService, UsuarioService, ConfirmationService],
})
export class UsuariosPage implements OnInit {
  editDialog: boolean = false;

  usuarios = signal<IUser[]>([]);

  usuario!: IUser;

  submitted: boolean = false;

  roles = [
    { label: 'Administrador', value: Role.ADMINISTRATOR },
    { label: 'Cliente', value: Role.CLIENT },
    { label: 'Eurodac', value: Role.EURODAC },
    { label: 'MBI', value: Role.MBI },
    { label: 'Operador', value: Role.OPERATOR },
    { label: 'Supervisor', value: Role.SUPERVISOR },
  ];

  cols: Column[] = [
    { field: 'nombre', header: 'Nombre' },
    { field: 'email', header: 'EMail' },
    { field: 'rol', header: 'Rol' },
    { field: 'estado', header: 'Estado' },
  ];

  protected readonly usuarioService = inject(UsuarioService);
  protected readonly messageService = inject(MessageService);
  protected readonly confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    this.usuarioService.getUsers().subscribe((data) => {
      this.usuarios.set(data);
    });
  }

  nombreRol(role: Role) {
    switch (role) {
      case Role.ADMINISTRATOR:
        return 'Administrador';
      case Role.CLIENT:
        return 'Cliente';
      case Role.EURODAC:
        return 'Eurodac';
      case Role.MBI:
        return 'MBI';
      case Role.OPERATOR:
        return 'Operador';
      case Role.SUPERVISOR:
        return 'Supervisor';
      default:
        return '';
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.usuario = {};
    this.submitted = false;
    this.editDialog = true;
  }

  editUser(user: IUser) {
    this.usuario = { ...user };
    this.editDialog = true;
  }

  hideDialog() {
    this.editDialog = false;
    this.submitted = false;
  }

  deleteUser(user: IUser) {
    this.hideDialog();
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar ' + user.username + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.delete(user.id!).subscribe(() => {
          this.usuario = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Usuario eliminado',
            life: 3000,
          });
          this.loadDemoData();
        });
      },
    });
  }

  getRolColor(role: Role) {
    switch (role) {
      case Role.EURODAC:
        return 'success';
      case Role.SUPERVISOR:
        return 'warn';
      case Role.ADMINISTRATOR:
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusColor(locked: boolean) {
    return locked ? 'danger' : 'success';
  }

  saveProduct() {
    this.submitted = true;

    if (this.usuario.id) {
      this.usuarioService.update(this.usuario.id, this.usuario).subscribe((data) => {
        this.messageService.add({
          severity: data ? 'success' : 'error',
          summary: data ? 'Correcto' : 'Error',
          detail: data ? 'Usuario actualizado' : 'Usuario no encontrado',
          life: 3000,
        });
        if (data) {
          this.loadDemoData();
        }
      });
    } else {
      this.usuarioService.create(this.usuario).subscribe((_) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Usuario creado',
          life: 3000,
        });
        this.loadDemoData();
      });
    }

    this.editDialog = false;
    this.usuario = {};
  }
}
