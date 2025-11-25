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
import { FieldType } from '@shared/models/auxiliar/command/post-auxiliar-request.model';
import { GetAuxiliar } from '@shared/models/auxiliar/query/get-auxiliar-response.model';

@Component({
  selector: 'edit-auxiliar',
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
        <small class="text-red-500" *ngIf="submitted() && !auxiliar().alias"
          >El alias es obligatorio</small
        >
      </div>

      <div>
        <label for="title" class="block font-bold mb-3">Título</label>
        <input id="title" pInputText [(ngModel)]="auxiliar().title" required fluid />
        <small class="text-red-500" *ngIf="submitted() && !auxiliar().title"
          >El título es obligatorio</small
        >
      </div>

      <div>
        <label for="creationDate" class="block font-bold mb-3">Fecha de creación</label>
        <p-datepicker
          inputId="creationDate"
          [(ngModel)]="auxiliar().creationDate"
          [showTime]="true"
          [hourFormat]="'24'"
          fluid
          required
          appendTo="body"
        ></p-datepicker>
        <small class="text-red-500" *ngIf="submitted() && !auxiliar().creationDate"
          >El data es obligatorio</small
        >
      </div>

      <div>
        <label for="type" class="block font-bold mb-3">Type</label>
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
        <small class="text-red-500" *ngIf="submitted() && !auxiliar().type"
          >El tipo es obligatorio</small
        >
      </div>

      <div>
        <label for="required" class="block font-bold mb-3">Requerido</label>
        <p-toggleswitch [(ngModel)]="auxiliar().required" inputId="required" />
      </div>

      <div
        *ngIf="
          auxiliar().type === FieldType.Numeric ||
          auxiliar().type === FieldType.Integer ||
          auxiliar().type === FieldType.CurrencyEuro
        "
      >
        <label class="block font-bold mb-3">Valores numéricos</label>
        <div>
          <label class="block text-sm">Mín</label>
          <p-inputNumber [(ngModel)]="auxiliar().minValue" fluid></p-inputNumber>
        </div>
        <div>
          <label class="block text-sm">Máx</label>
          <p-inputNumber [(ngModel)]="auxiliar().maxValue" fluid></p-inputNumber>
        </div>
        <div *ngIf="auxiliar().type === FieldType.Numeric">
          <label class="block text-sm">Decimales</label>
          <p-inputNumber [(ngModel)]="auxiliar().decimals" fluid></p-inputNumber>
        </div>
      </div>

      <div *ngIf="auxiliar().type === FieldType.Text">
        <label class="block font-bold mb-3">Texto</label>
        <label class="block text-sm">Longitud máxima</label>
        <p-inputNumber [(ngModel)]="auxiliar().maxLength" fluid></p-inputNumber>
      </div>

      <div *ngIf="auxiliar().type === FieldType.List">
        <label class="block font-bold mb-3">Opciones</label>
        <div
          *ngFor="let opt of auxiliar().options; let i = index"
          class="flex gap-1 items-center mb-2"
        >
          <input pInputText [(ngModel)]="opt.code" placeholder="Código" />
          <input pInputText [(ngModel)]="opt.description" placeholder="Descripción" />
          <p-button label="Eliminar" severity="danger" outlined (onClick)="removeOption(i)" />
        </div>
        <button pButton type="button" (click)="addOption()">Añadir opción</button>
      </div>
    </div>
  `,
  providers: [],
})
export class AuxiliarEditComponent {
  auxiliar = input.required<GetAuxiliar>();
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
    this.auxiliar().options.push({ code: '', description: '' });
  }

  removeOption(index: number) {
    this.auxiliar().options.splice(index, 1);
  }
}
