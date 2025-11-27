import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { AppLayout } from '@shared/layout/app.layout';
import { UsuariosPage } from './features/admin/usuarios/usuarios.page';
import { ConsultasPage } from './features/cases/cases.page';
import { AuxiliaresPage } from './features/admin/auxiliares/auxiliares.page';
import { Notfound } from './shared/components/not-found.page';
import { AlertasPage } from './features/admin/alertas/alertas.page';
import { authGuard } from '@shared/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    data: { projectName: 'Expert' },
    children: [
      { path: '', component: DashboardPage },
      { path: 'consultas', component: ConsultasPage },
      {
        path: 'admin',
        children: [
          { path: 'usuarios', component: UsuariosPage },
          { path: 'alertas', component: AlertasPage },
          { path: 'auxiliares', component: AuxiliaresPage },
        ],
      },
    ],
  },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' },
];
