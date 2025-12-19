import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import {
  AlertCodeListDto,
  AlertFieldNameDto,
  AlertFieldType,
  AlertResponseDto,
  RuleClause,
  RuleGroup,
} from '@shared/models/alert/query/alert-response.model';
import { AlertasService } from './alertas.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'edit-alertas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    ToggleSwitchModule,
    InputNumberModule,
    DatePickerModule,
    TextareaModule,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <!-- Alert Metadata -->
      <div>
        <label for="name" class="block font-bold mb-3">Nombre</label>
        <input id="name" pInputText [(ngModel)]="alert().name" required autofocus fluid />

        @if(submitted() && !alert().name) {
        <small class="text-red-500">El nombre es obligatorio</small>
        }
      </div>

      @if(alert().id) {
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-bold mb-3">Última modificación</label>
          <input
            class="outline-none"
            [value]="alert().lastModifiedAt | date : 'dd/MM/yyyy HH:mm'"
            readonly
            fluid
          />
        </div>
        <div>
          <label class="block font-bold mb-3">Modificado por</label>
          <input class="outline-none" [value]="alert().lastModifiedBy" readonly fluid />
        </div>
      </div>
      }

      <div>
        <label for="active" class="block font-bold mb-3">Activo</label>
        <p-toggleswitch [(ngModel)]="alert().active" inputId="active" />
      </div>

      <!-- Rule Editor -->
      <div class="border-t pt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">Reglas de filtrado</h3>
        </div>

        @if(alert().ruleGroup) {
        <div class="rule-editor">
          <ng-container
            [ngTemplateOutlet]="ruleGroupTemplate"
            [ngTemplateOutletContext]="{
              group: alert().ruleGroup,
              depth: 0,
              parentGroup: null,
              indexInParent: -1
            }"
          ></ng-container>
        </div>
        }
      </div>
    </div>

    <!-- Rule Group Template (Recursive) -->
    <ng-template
      #ruleGroupTemplate
      let-group="group"
      let-depth="depth"
      let-parentGroup="parentGroup"
      let-indexInParent="indexInParent"
    >
      <div
        class="rule-group p-4 border rounded-lg mb-3"
        [style.margin-left.rem]="depth * 2"
        [class.bg-gray-50]="depth % 2 === 0"
        [class.bg-white]="depth % 2 === 1"
      >
        <!-- Group Header -->
        <div class="flex items-center gap-3 mb-4">
          <p-select
            [(ngModel)]="group.operator"
            [options]="operatorOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Operador"
            [style]="{ width: '120px' }"
            appendTo="body"
          ></p-select>

          @if(depth > 0) {
          <p-button
            label="Eliminar grupo"
            severity="danger"
            size="small"
            outlined
            (onClick)="removeGroup(parentGroup, indexInParent)"
          />
          }
        </div>

        <!-- Children (Clauses and Nested Groups) -->
        <div class="flex flex-col gap-3">
          @for(child of group.children; track $index) {
          <div>
            @if(isRuleClause(child)) {
            <!-- Render Clause -->
            <div class="flex gap-3 items-start">
              <div class="flex-1">
                <p-select
                  [(ngModel)]="child.field"
                  [options]="availableFields"
                  optionLabel="displayName"
                  optionValue="fieldName"
                  placeholder="Campo"
                  fluid
                  appendTo="body"
                ></p-select>

                @if(submitted() && !child.field) {
                <small class="text-red-500">El campo es obligatorio</small>
                }
              </div>

              <div class="flex-1">
                <p-select
                  [(ngModel)]="child.operator"
                  [options]="getOperatorsForField(child.field)"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Operador"
                  (ngModelChange)="onOperadorChange(child)"
                  fluid
                  appendTo="body"
                ></p-select>

                @if(submitted() && !child.operator) {
                <small class="text-red-500">El operador es obligatorio</small>
                }
              </div>

              <div class="flex-1">
                <ng-container
                  [ngTemplateOutlet]="valueInputTemplate"
                  [ngTemplateOutletContext]="{ clause: child }"
                ></ng-container>
              </div>

              <p-button
                label="Eliminar"
                severity="danger"
                size="small"
                outlined
                (onClick)="removeClause(group, $index)"
              />
            </div>
            } @else {
            <!-- Render Nested Group -->
            <ng-container
              [ngTemplateOutlet]="ruleGroupTemplate"
              [ngTemplateOutletContext]="{
                group: child,
                depth: depth + 1,
                parentGroup: group,
                indexInParent: $index
              }"
            ></ng-container>
            }
          </div>
          }
        </div>

        <!-- Add Buttons -->
        <div class="flex gap-2 mt-4">
          <p-button
            label="Añadir condición"
            icon="pi pi-plus"
            size="small"
            (onClick)="addClause(group)"
          />
          <p-button
            label="Añadir grupo"
            icon="pi pi-plus"
            severity="secondary"
            size="small"
            outlined
            (onClick)="addNestedGroup(group)"
          />
        </div>
      </div>
    </ng-template>

    <!-- Value Input Template -->
    <ng-template #valueInputTemplate let-clause="clause">
      @if(getFieldType(clause.field) === AlertFieldType.Date) {
      <p-datepicker
        [(ngModel)]="clause.value"
        dateFormat="dd/mm/yy"
        placeholder="Selecciona fecha"
        fluid
        appendTo="body"
      ></p-datepicker>
      } @else if(getFieldType(clause.field) === AlertFieldType.SexList || getFieldType(clause.field)
      === AlertFieldType.DocTypeList || getFieldType(clause.field) === AlertFieldType.CountryList) {
      @if (clause.operator === 'En' || clause.operator === 'No en') {
      <!-- MULTI SELECT -->
      <p-multiselect
        [(ngModel)]="clause.value"
        [options]="getCodeListForField(clause.field)"
        optionLabel="name"
        optionValue="code"
        placeholder="Selección múltiple"
        fluid
        appendTo="body"
      ></p-multiselect>
      } @else {
      <!-- SINGLE SELECT -->
      <p-select
        [(ngModel)]="clause.value"
        [options]="getCodeListForField(clause.field)"
        optionLabel="name"
        optionValue="code"
        placeholder="Selecciona"
        fluid
        appendTo="body"
      ></p-select>
      } } @else if(getFieldType(clause.field) === AlertFieldType.Number) {
      <p-inputNumber [(ngModel)]="clause.value" placeholder="Valor" fluid></p-inputNumber>
      } @else {
      <input pInputText [(ngModel)]="clause.value" placeholder="Texto" fluid />
      } @if(submitted() && clause.value === undefined) {
      <small class="text-red-500">El valor es obligatorio</small>
      }
    </ng-template>
  `,
  styles: [
    `
      .rule-editor {
        font-size: 0.95rem;
      }

      .rule-group {
        transition: all 0.2s ease;
      }

      .rule-group:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class AlertasEditComponent implements OnInit {
  alert = input.required<AlertResponseDto>();
  submitted = input.required<boolean>();

  protected readonly AlertFieldType = AlertFieldType;
  protected readonly alertasService = inject(AlertasService);

  // Available fields for rule clauses
  availableFields: AlertFieldNameDto[] = this.alertasService.getAvailableFields();

  // Operator options for rule groups
  operatorOptions = this.alertasService.getLogicalOperators();
  sexList: AlertCodeListDto[] = this.alertasService.getSexList();
  docTypeList: AlertCodeListDto[] = this.alertasService.getDocTypeList();
  countryList: AlertCodeListDto[] = this.alertasService.getCountryList();

  ngOnInit() {
    // Initialize rule group if not present
    if (!this.alert().ruleGroup) {
      this.alert().ruleGroup = { operator: 'AND', children: [] };
    }
  }

  // Check if item is a clause (vs group)
  isRuleClause(item: RuleGroup | RuleClause): item is RuleClause {
    return 'field' in item;
  }

  // Add a new clause to a group
  addClause(group: RuleGroup) {
    group.children.push({
      field: '',
      operator: '',
      value: undefined,
    });
  }

  // Add a nested group
  addNestedGroup(group: RuleGroup) {
    group.children.push({
      operator: 'AND',
      children: [],
    });
  }

  // Remove a clause from a group
  removeClause(group: RuleGroup, index: number) {
    group.children.splice(index, 1);
  }

  // Remove a nested group
  removeGroup(parentGroup: RuleGroup | null, index: number) {
    if (parentGroup) {
      parentGroup.children.splice(index, 1);
    }
  }

  // Get operators based on field type
  getOperatorsForField(fieldName: string) {
    const field = this.availableFields.find((f) => f.fieldName === fieldName);
    if (!field) {
      return [];
    }

    switch (field.type) {
      case AlertFieldType.Number:
      case AlertFieldType.Date:
        return [
          { label: 'Igual a', value: '=' },
          { label: 'Diferente de', value: '<>' },
          { label: 'Mayor que', value: '>' },
          { label: 'Mayor o igual que', value: '>=' },
          { label: 'Menor que', value: '<' },
          { label: 'Menor o igual que', value: '<=' },
        ];
      case AlertFieldType.Text:
        return [
          { label: 'Igual a', value: '=' },
          { label: 'Diferente de', value: '<>' },
          { label: 'Contiene', value: 'Contiene' },
          { label: 'No contiene', value: 'No contiene' },
          { label: 'Comienza con', value: 'Comienza con' },
          { label: 'Termina con', value: 'Termina con' },
        ];
      case AlertFieldType.SexList:
      case AlertFieldType.DocTypeList:
      case AlertFieldType.CountryList:
        return [
          { label: 'Igual a', value: '=' },
          { label: 'Diferente de', value: '<>' },
          { label: 'En la lista', value: 'En' },
          { label: 'No en la lista', value: 'No en' },
        ];
      default:
        return [
          { label: 'Igual a', value: '=' },
          { label: 'Diferente de', value: '<>' },
          { label: 'Contiene', value: 'Contiene' },
          { label: 'No contiene', value: 'No contiene' },
        ];
    }
  }

  // Get field type
  getFieldType(fieldName: string): AlertFieldType | undefined {
    const field = this.availableFields.find((f) => f.fieldName === fieldName);
    return field?.type;
  }

  // Get code list for field
  getCodeListForField(fieldName: string): AlertCodeListDto[] {
    const fieldType = this.getFieldType(fieldName);
    switch (fieldType) {
      case AlertFieldType.SexList:
        return this.sexList;
      case AlertFieldType.DocTypeList:
        return this.docTypeList;
      case AlertFieldType.CountryList:
        return this.countryList;
      default:
        return [];
    }
  }

  onOperadorChange(clause: RuleClause) {
    const isMultiSelect = clause.operator === 'En' || clause.operator === 'No en';

    if (isMultiSelect) {
      this.convertToArrayValue(clause);
    } else {
      this.convertToSingleValue(clause);
    }
  }

  private convertToArrayValue(clause: RuleClause) {
    if (!Array.isArray(clause.value)) {
      clause.value = [];
    }
  }

  private convertToSingleValue(clause: RuleClause) {
    if (Array.isArray(clause.value)) {
      clause.value = clause.value.length > 0 ? clause.value[0] : undefined;
    }
  }
}
