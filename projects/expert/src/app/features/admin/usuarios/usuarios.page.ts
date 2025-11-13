import { Component, inject, Injectable, OnInit, signal, ViewChild } from '@angular/core';
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
import { Product, UsuarioService } from './usuario.service';
import { Role } from '@shared/services/user-repository.service';

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
  template: `<p-toolbar styleClass="mb-6">
      <ng-template #start>
        <p-button
          label="Añadir usuario"
          icon="pi pi-plus"
          severity="secondary"
          class="mr-2"
          (onClick)="openNew()"
        />
        <p-button
          severity="secondary"
          label="Eliminar"
          icon="pi pi-trash"
          outlined
          (onClick)="deleteSelected()"
          [disabled]="!selectedUsuarios || !selectedUsuarios.length"
        />
      </ng-template>

      <ng-template #end> </ng-template>
    </p-toolbar>

    <p-table
      #dt
      [value]="usuarios()"
      [rows]="10"
      [columns]="cols"
      [paginator]="true"
      [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
      [tableStyle]="{ 'min-width': '75rem' }"
      [(selection)]="selectedUsuarios"
      [rowHover]="true"
      dataKey="id"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
    >
      <ng-template #caption>
        <div class="flex items-center justify-between">
          <h5 class="m-0">Usuarios</h5>
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
      </ng-template>
      <ng-template #header>
        <tr>
          <th style="width: 3rem">
            <p-tableHeaderCheckbox />
          </th>
          <th style="min-width: 16rem">Nombre</th>
          <th style="min-width:16rem">eMail</th>
          <th>Rol</th>
          <th style="min-width: 8rem">Estado</th>
        </tr>
      </ng-template>
      <ng-template #body let-product>
        <tr>
          <td style="width: 3rem">
            <p-tableCheckbox [value]="product" />
          </td>
          <td style="min-width: 12rem">
            <button (click)="editProduct(product)" class="p-button p-button-text">
              {{ product.code }}
            </button>
          </td>
          <td style="min-width: 16rem">{{ product.name }}</td>
          <td style="width: 64px">
            <p-tag
              [value]="product.inventoryStatus"
              [severity]="getSeverity(product.inventoryStatus)"
            />
          </td>
          <td>
            <p-tag
              [value]="product.inventoryStatus"
              [severity]="getSeverity(product.inventoryStatus)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog
      [(visible)]="editDialog"
      [style]="{ width: '450px' }"
      header="Product Details"
      [modal]="true"
    >
      <ng-template #content>
        <div class="flex flex-col gap-6">
          <img
            [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + usuario.image"
            [alt]="usuario.image"
            class="block m-auto pb-4"
            *ngIf="usuario.image"
          />
          <div>
            <label for="name" class="block font-bold mb-3">Name</label>
            <input
              type="text"
              pInputText
              id="name"
              [(ngModel)]="usuario.name"
              required
              autofocus
              fluid
            />
            <small class="text-red-500" *ngIf="submitted && !usuario.name">Name is required.</small>
          </div>
          <div>
            <label for="description" class="block font-bold mb-3">Description</label>
            <textarea
              id="description"
              pTextarea
              [(ngModel)]="usuario.description"
              required
              rows="3"
              cols="20"
              fluid
            ></textarea>
          </div>

          <div>
            <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
            <p-select
              [(ngModel)]="usuario.inventoryStatus"
              inputId="inventoryStatus"
              [options]="roles"
              optionLabel="label"
              optionValue="label"
              placeholder="Select a Status"
              fluid
            />
          </div>

          <div>
            <span class="block font-bold mb-4">Category</span>
            <div class="grid grid-cols-12 gap-4">
              <div class="flex items-center gap-2 col-span-6">
                <p-radiobutton
                  id="category1"
                  name="category"
                  value="Accessories"
                  [(ngModel)]="usuario.category"
                />
                <label for="category1">Accessories</label>
              </div>
              <div class="flex items-center gap-2 col-span-6">
                <p-radiobutton
                  id="category2"
                  name="category"
                  value="Clothing"
                  [(ngModel)]="usuario.category"
                />
                <label for="category2">Clothing</label>
              </div>
              <div class="flex items-center gap-2 col-span-6">
                <p-radiobutton
                  id="category3"
                  name="category"
                  value="Electronics"
                  [(ngModel)]="usuario.category"
                />
                <label for="category3">Electronics</label>
              </div>
              <div class="flex items-center gap-2 col-span-6">
                <p-radiobutton
                  id="category4"
                  name="category"
                  value="Fitness"
                  [(ngModel)]="usuario.category"
                />
                <label for="category4">Fitness</label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <label for="price" class="block font-bold mb-3">Price</label>
              <p-inputnumber
                id="price"
                [(ngModel)]="usuario.price"
                mode="currency"
                currency="USD"
                locale="en-US"
                fluid
              />
            </div>
            <div class="col-span-6">
              <label for="quantity" class="block font-bold mb-3">Quantity</label>
              <p-inputnumber id="quantity" [(ngModel)]="usuario.quantity" fluid />
            </div>
          </div>
        </div>
      </ng-template>

      <ng-template #footer>
        <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
        <p-button label="Save" icon="pi pi-check" (click)="saveProduct()" />
      </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" /> `,
  providers: [MessageService, UsuarioService, ConfirmationService],
})
export class UsuariosPage implements OnInit {
  editDialog: boolean = false;

  usuarios = signal<Product[]>([]);

  usuario!: Product;

  selectedUsuarios!: Product[] | null;

  submitted: boolean = false;

  roles!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  protected readonly usuarioService = inject(UsuarioService);
  protected readonly messageService = inject(MessageService);
  protected readonly confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    this.usuarioService.getProducts().then((data) => {
      this.usuarios.set(data);
    });

    this.roles = [
      { label: 'Administrador', value: Role.ADMINISTRATOR },
      { label: 'Cliente', value: Role.CLIENT },
      { label: 'Eurodac', value: Role.EURODAC },
      { label: 'MBI', value: Role.MBI },
      { label: 'Operador', value: Role.OPERATOR },
      { label: 'Supervisor', value: Role.SUPERVISOR },
    ];

    this.cols = [
      { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.usuario = {};
    this.submitted = false;
    this.editDialog = true;
  }

  editProduct(product: Product) {
    this.usuario = { ...product };
    this.editDialog = true;
  }

  deleteSelected() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarios.set(this.usuarios().filter((val) => !this.selectedUsuarios?.includes(val)));
        this.selectedUsuarios = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.editDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarios.set(this.usuarios().filter((val) => val.id !== product.id));
        this.usuario = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.usuarios().length; i++) {
      if (this.usuarios()[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  saveProduct() {
    this.submitted = true;
    let _products = this.usuarios();
    if (this.usuario.name?.trim()) {
      if (this.usuario.id) {
        _products[this.findIndexById(this.usuario.id)] = this.usuario;
        this.usuarios.set([..._products]);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        this.usuario.id = this.createId();
        this.usuario.image = 'product-placeholder.svg';
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
        this.usuarios.set([..._products, this.usuario]);
      }

      this.editDialog = false;
      this.usuario = {};
    }
  }
}
