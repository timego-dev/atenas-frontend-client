import { Component, inject, OnInit, signal } from '@angular/core';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { UsuarioEditComponent } from './usuario-edit.component';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
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
    ToggleSwitchModule,
    UsuarioEditComponent,
  ],
  templateUrl: './usuarios.page.html',
  providers: [MessageService, UsuarioService, ConfirmationService],
})
export class UsuariosPage implements OnInit {
  editDialog: boolean = false;

  usuarios = signal<IUser[]>([]);

  usuario!: IUser;

  submitted: boolean = false;

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
