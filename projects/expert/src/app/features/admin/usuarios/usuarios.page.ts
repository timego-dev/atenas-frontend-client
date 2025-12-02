import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { UsuarioEditComponent } from './usuario-edit.component';
import { UserResponseDto } from '@shared/models/user/query/user-response.model';
import { RoleType } from '@shared/models/user/user.shared';
import {
  createEmptyUserRequest,
  UserRequestDto,
} from '@shared/models/user/command/user-request.model';

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
  providers: [UsuarioService, ConfirmationService],
})
export class UsuariosPage implements OnInit {
  editDialogComponent = viewChild<UsuarioEditComponent>('editDialogComponent');

  editDialog: boolean = false;

  usuarios = signal<UserResponseDto[]>([]);

  selectedUser: UserResponseDto | null = null; // the table row selected
  editingUser: UserRequestDto = createEmptyUserRequest(); // the form model

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
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuarioService.getAll().subscribe((data) => this.usuarios.set(data));
  }

  nombreRol(role: RoleType): string {
    const roles: Record<RoleType, string> = {
      [RoleType.ADMINISTRATOR]: 'Administrador',
      [RoleType.ATENAS_CLIENT]: 'Cliente',
      [RoleType.EURODAC_CLIENT]: 'Eurodac',
      [RoleType.MBI_CLIENT]: 'MBI',
      [RoleType.OPERATOR]: 'Operador',
      [RoleType.SUPERVISOR]: 'Supervisor',
    };
    return roles[role] ?? '';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.selectedUser = null; // new user → no id!
    this.editingUser = createEmptyUserRequest();
    this.submitted = false;
    this.editDialog = true;
  }

  editUser(user: UserResponseDto) {
    this.selectedUser = user;

    this.editingUser = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      enabled: user.enabled, // or whatever logic matches your API
    };

    this.editDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.editDialog = false;
    this.submitted = false;
  }

  deleteUser(user: UserResponseDto) {
    this.hideDialog();
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar ' + user.username + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.delete(user.id!).subscribe(() => {
          this.selectedUser = null;
          this.editingUser = createEmptyUserRequest();
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Usuario eliminado',
            life: 3000,
          });
          this.loadUsuarios();
        });
      },
    });
  }

  getRolColor(role: RoleType) {
    switch (role) {
      case RoleType.EURODAC_CLIENT:
        return 'success';
      case RoleType.SUPERVISOR:
        return 'warn';
      case RoleType.ADMINISTRATOR:
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusColor(locked: boolean) {
    return locked ? 'danger' : 'success';
  }

  guardar() {
    this.submitted = true;

    if (this.selectedUser) {
      this.usuarioService.update(this.selectedUser.id, this.editingUser).subscribe((data) => {
        this.messageService.add({
          severity: data ? 'success' : 'error',
          summary: data ? 'Correcto' : 'Error',
          detail: data ? 'Usuario actualizado' : 'Usuario no encontrado',
          life: 3000,
        });
        if (data) {
          this.loadUsuarios();
        }
      });
    } else {
      this.usuarioService.create(this.editingUser).subscribe((_) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Usuario creado',
          life: 3000,
        });
        this.loadUsuarios();
      });
    }

    this.editDialog = false;
    this.editingUser = createEmptyUserRequest();
    this.selectedUser = null;
  }
}
