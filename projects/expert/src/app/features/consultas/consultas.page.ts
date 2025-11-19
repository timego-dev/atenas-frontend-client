import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConsultasService } from './consultas.service';

import { IConsulta } from './consultas.service';
import { TiempoEntrada } from '../../shared/components/tiempo-entrada.component';
import { TiempoRespuesta } from '../../shared/components/tiempo-respuesta.component';
import { EstadoConsultaComponent } from '../../shared/components/estado-consulta.component';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'page-consultas',
  standalone: true,
  imports: [
    PanelModule,
    MenuModule,
    TableModule,
    ButtonModule,
    TagModule,
    TiempoEntrada,
    TiempoRespuesta,
    EstadoConsultaComponent,
    SelectModule,
    FormsModule,
    MultiSelectModule,
  ],
  templateUrl: './consultas.page.html',
  providers: [],
})
export class ConsultasPage {
  private readonly consultasService = inject(ConsultasService);

  protected consultas: IConsulta[] = [];
  private readonly ref = inject(ChangeDetectorRef);

  constructor() {
    this.consultasService.consultasFiltradas$.subscribe((data) => {
      this.consultas = data;
    });
    setInterval(() => this.ref.detectChanges(), 1000);
  }

  estados = [
    { label: 'Pendientes', value: 'pendientes' },
    { label: 'En curso', value: 'en-curso' },
    { label: 'Resueltas', value: 'resueltas' },
  ];

  estado = [];

  respuestas = [
    { label: 'Autenticos', value: 'autenticos' },
    { label: 'Falsos', value: 'falsos' },
    { label: 'Falta información', value: 'falta-informacion' },
  ];

  respuesta = [];

  periodos = [
    { label: 'Hoy', value: 'hoy' },
    { label: 'Esta semana', value: 'esta-semana' },
    { label: 'Este mes', value: 'este-mes' },
    { label: 'Este año', value: 'este-año' },
    { label: 'Otro', value: 'otro' },
  ];

  periodo = '';

  menuItems = [
    {
      label: 'Estado',
      items: [
        {
          label: 'Todas',
          icon: 'pi pi-fw pi-list',
        },
        {
          label: 'Pendientes',
          icon: 'pi pi-fw pi-clock',
        },
        {
          label: 'En curso',
          icon: 'pi pi-fw pi-file',
        },
        {
          label: 'Resueltas',
          icon: 'pi pi-fw pi-check',
        },
      ],
    },
    {
      label: 'Resolución',
      items: [
        {
          label: 'Todas',
          icon: 'pi pi-fw pi-list',
        },
        {
          label: 'Auténticos',
          icon: 'pi pi-fw pi-thumbs-up',
        },
        {
          label: 'Falsos',
          icon: 'pi pi-fw pi-thumbs-down',
        },
        {
          label: 'Falta información',
          icon: 'pi pi-fw pi-question-circle',
        },
      ],
    },
    {
      label: 'Periodo',
      items: [
        {
          label: 'Todas',
          icon: 'pi pi-fw pi-list',
        },
        {
          label: 'Hoy',
          icon: 'pi pi-fw pi-calendar',
        },
        {
          label: 'Esta semana',
          icon: 'pi pi-fw pi-calendar',
        },
        {
          label: 'Este mes',
          icon: 'pi pi-fw pi-calendar',
        },
        {
          label: 'Este año',
          icon: 'pi pi-fw pi-calendar',
        },
        {
          label: 'Otro',
          icon: 'pi pi-fw pi-calendar',
        },
      ],
    },
  ];

  cols: Column[] = [
    { field: 'code', header: 'Referencia' },
    { field: 'name', header: 'Entrada' },
    { field: 'image', header: 'Origen' },
    { field: 'price', header: 'Tiempo respuesta' },
    { field: 'category', header: 'Operador' },
    { field: 'category', header: 'Estado' },
  ];

  editConsulta(consulta: IConsulta) {
    console.log('Edit');
  }
}
