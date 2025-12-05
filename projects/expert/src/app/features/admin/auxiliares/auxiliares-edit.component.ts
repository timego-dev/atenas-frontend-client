import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import {
  AuxiliarResponseDto,
  FieldType,
} from '@shared/models/auxiliar/query/auxiliar-response.model';

@Component({
  selector: 'edit-auxiliares',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DatePickerModule,
    IconFieldModule,
    ToggleSwitchModule,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div>
        <label for="alias" class="block font-bold mb-3">Alias</label>
        <input id="alias" pInputText [(ngModel)]="auxiliar().alias" required autofocus fluid />

        @if(submitted() && !auxiliar().alias) {
        <small class="text-red-500">El alias es obligatorio</small>
        }
      </div>

      <div>
        <label for="title" class="block font-bold mb-3">Título</label>
        <input id="title" pInputText [(ngModel)]="auxiliar().title" required fluid />

        @if(submitted() && !auxiliar().title) {
        <small class="text-red-500">El título es obligatorio</small>
        }
      </div>

      @if(auxiliar().id) {
      <div>
        <label for="creationDate" class="block font-bold mb-3">Fecha de creación</label>
        <input
          id="creationDate"
          class="outline-none"
          [value]="auxiliar().creationDate | date : 'dd/MM/yyyy HH:mm'"
          readonly
          fluid
        />
      </div>
      }

      <div>
        <label for="type" class="block font-bold mb-3">Tipo</label>
        <p-select
          inputId="type"
          [(ngModel)]="auxiliar().type"
          [options]="typeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona el tipo"
          fluid
          appendTo="body"
        ></p-select>

        @if(submitted() && !auxiliar().type) {
        <small class="text-red-500">El tipo es obligatorio</small>
        }
      </div>

      <div>
        <label for="required" class="block font-bold mb-3">Requerido</label>
        <p-toggleswitch [(ngModel)]="auxiliar().required" inputId="required" />
      </div>

      @if(auxiliar().type === FieldType.Numeric || auxiliar().type === FieldType.Integer ||
      auxiliar().type === FieldType.CurrencyEuro) {
      <div>
        <label class="block font-bold mb-3">Valores numéricos</label>
        <div>
          <label class="block text-sm">Mín</label>
          <p-inputNumber [(ngModel)]="auxiliar().minValue" required fluid></p-inputNumber>

          @if(submitted() && !auxiliar().minValue) {
          <small class="text-red-500"
            >El valor mínimo es necesario para tipos numéricos o enteros.</small
          >
          }
        </div>
        <div>
          <label class="block text-sm">Máx</label>
          <p-inputNumber [(ngModel)]="auxiliar().maxValue" required fluid></p-inputNumber>

          @if(submitted() && !auxiliar().maxValue) {
          <small class="text-red-500"
            >Se requiere valor máximo para tipos numéricos o enteros.</small
          >
          }
        </div>
        <div *ngIf="auxiliar().type !== FieldType.Integer">
          <label class="block text-sm">Decimales</label>
          <p-inputNumber [(ngModel)]="auxiliar().decimals" required fluid></p-inputNumber>

          @if(submitted() && auxiliar().type === FieldType.CurrencyEuro && auxiliar().decimals !==
          2) {
          <small class="text-red-500">La moneda Euro debe tener 2 decimales.</small>
          } @else if (submitted() && auxiliar().type === FieldType.Numeric && !auxiliar().decimals)
          {
          <small class="text-red-500">Se requieren decimales para el tipo numérico.</small>
          }
        </div>
      </div>
      } @else if (auxiliar().type === FieldType.Text) {
      <div>
        <label class="block font-bold mb-3">Texto</label>
        <label class="block text-sm">Longitud máxima</label>
        <p-inputNumber [(ngModel)]="auxiliar().maxLength" required fluid></p-inputNumber>

        @if(submitted() && !auxiliar().maxLength) {
        <small class="text-red-500">Se requiere longitud máxima para el tipo de texto.</small>
        }
      </div>
      } @else if (auxiliar().type === FieldType.List) {
      <div>
        <label class="block font-bold mb-3">Opciones</label>

        @if(submitted() && (!auxiliar().options || auxiliar().options?.length === 0)) {
        <small class="text-red-500 block pb-3">Se requieren opciones para el tipo de lista.</small>
        }

        <div
          *ngFor="let opt of auxiliar().options; let i = index"
          class="flex gap-3 items-start mb-4"
        >
          <div class="flex-1">
            <input pInputText [(ngModel)]="opt.code" placeholder="Código" required fluid />

            @if(submitted() && !opt.code) {
            <small class="block text-red-500">Opción {{ i + 1 }}: se requiere código.</small>
            }
          </div>

          <div class="flex-1">
            <input
              pInputText
              [(ngModel)]="opt.description"
              placeholder="Descripción"
              required
              fluid
            />

            @if(submitted() && !opt.description) {
            <small class="block text-red-500">Opción {{ i + 1 }}: se requiere descripción.</small>
            }
          </div>

          <p-button label="Eliminar" severity="danger" outlined (onClick)="removeOption(i)" />
        </div>
        <button pButton type="button" (click)="addOption()">Añadir opción</button>
      </div>
      }
    </div>
  `,
  providers: [],
})
export class AuxiliaresEditComponent {
  auxiliar = input.required<AuxiliarResponseDto>();
  submitted = input.required<boolean>();

  protected readonly FieldType = FieldType;

  typeOptions = [
    { label: 'Texto', value: FieldType.Text },
    { label: 'Número entero', value: FieldType.Integer },
    { label: 'Número decimal', value: FieldType.Numeric },
    { label: 'Moneda Euro', value: FieldType.CurrencyEuro },
    { label: 'Lista', value: FieldType.List },
  ];

  addOption() {
    this.auxiliar().options?.push({ code: '', description: '' });
  }

  removeOption(index: number) {
    this.auxiliar().options?.splice(index, 1);
  }
}
