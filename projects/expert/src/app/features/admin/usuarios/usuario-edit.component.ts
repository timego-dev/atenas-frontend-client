import { Component, input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { UsuarioService } from './usuarios.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { UserRequestDto } from '@shared/models/user/command/user-request.model';
import { RoleType } from '@shared/models/user/user.shared';

@Component({
  selector: 'edit-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    IconFieldModule,
    ToggleSwitchModule,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div>
        <label for="nombre" class="block font-bold mb-3">Nombre</label>
        <input
          type="text"
          pInputText
          id="nombre"
          [(ngModel)]="usuario().username"
          required
          autofocus
          fluid
        />
        @if (submitted() && !usuario().username) {
        <small class="text-red-500">El nombre es obligatorio</small>
        }
      </div>

      <div>
        <label for="email" class="block font-bold mb-3">EMail</label>
        <input type="email" id="email" pInputText [(ngModel)]="usuario().email" required fluid />
      </div>

      <!-- <div>
        <label for="role" class="block font-bold mb-3">Rol</label>
        <p-select
          [(ngModel)]="usuario().role"
          inputId="role"
          [options]="roles"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona el rol"
          fluid
          appendTo="body"
        />
      </div> -->

      <div>
        <label for="locked" class="block font-bold mb-3">Bloqueado</label>

        <p-toggleswitch [(ngModel)]="enabledInverted" inputId="locked" />
      </div>
    </div>
  `,
  providers: [MessageService, UsuarioService, ConfirmationService],
})
export class UsuarioEditComponent {
  usuario = input.required<UserRequestDto>();
  submitted = input.required<boolean>();

  roles = [
    { label: 'Administrador', value: RoleType.ADMINISTRATOR },
    { label: 'Cliente', value: RoleType.ATENAS_CLIENT },
    { label: 'Eurodac', value: RoleType.EURODAC_CLIENT },
    { label: 'MBI', value: RoleType.MBI_CLIENT },
    { label: 'Operador', value: RoleType.OPERATOR },
    { label: 'Supervisor', value: RoleType.SUPERVISOR },
  ];

  get enabledInverted(): boolean {
    return !this.usuario().enabled;
  }

  set enabledInverted(value: boolean) {
    this.usuario().enabled = !value;
  }
}
