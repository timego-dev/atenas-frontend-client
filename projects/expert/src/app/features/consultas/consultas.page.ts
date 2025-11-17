import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'page-consultas',
  standalone: true,
  imports: [PanelModule, MenuModule, TableModule, ButtonModule, RouterLink],
  templateUrl: './consultas.page.html',
  providers: [],
})
export class ConsultasPage {
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
          icon: 'pi pi-fw pi-search',
        },
        {
          label: 'Esta semana',
          icon: 'pi pi-fw pi-search',
        },
        {
          label: 'Este mes',
          icon: 'pi pi-fw pi-search',
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

  consultas() {
    return [
      {
        referencia: 'referencia',
        origen: 'origen',
        fechaEntrada: 'fecha entrada',
        tiempoRespuesta: 'tiempoRespuesta',
        operador: 'operador',
        estado: 'estado',
      },
    ];
  }
}
