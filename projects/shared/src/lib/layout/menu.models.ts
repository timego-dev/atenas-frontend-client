import { MenuItem } from 'primeng/api';

export const EXPERT_MENU: MenuItem[] = [
  {
    label: 'Inicio',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
  },
  {
    label: 'Gestión',
    items: [{ label: 'Consultas', icon: 'pi pi-fw pi-list', routerLink: ['/consultas'] }],
  },
  {
    label: 'Administración',
    icon: 'pi pi-fw pi-briefcase',
    routerLink: ['/admin'],
    items: [
      { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/admin/usuarios'] },
      { label: 'Alertas', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/alertas'] },
      { label: 'Campos auxiliares', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/auxiliares'] },
    ],
  },
];

export const EURODAC_MENU: MenuItem[] = [
  {
    label: 'Inicio',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
  },
  {
    label: 'Gestión',
    items: [{ label: 'Consultas', icon: 'pi pi-fw pi-list', routerLink: ['/consultas'] }],
  },
];

export const DEFAULT_MENU: MenuItem[] = [
  {
    label: 'Inicio',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
  },
];
