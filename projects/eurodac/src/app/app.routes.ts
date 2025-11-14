import { Routes } from '@angular/router';
import { AppLayout } from '@shared/layout/app.layout';
import { Notfound } from './shared/components/not-found.page';
import { DemoDocumentScannerPage } from './features/document-scanner/pages/demo-document-scanner/demo-document-scanner.page';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    data: { projectName: 'Eurodac' },
    children: [{ path: '', component: DemoDocumentScannerPage }],
  },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' },
];
