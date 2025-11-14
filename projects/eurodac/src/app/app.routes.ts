import { Routes } from '@angular/router';
import { AppLayout } from '@shared/layout/app.layout';
import { Notfound } from './shared/components/not-found.page';
import { DashboardPage } from './features/dashboard/dashboard.page';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [{ path: '', component: DashboardPage }],
  },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' },
];
