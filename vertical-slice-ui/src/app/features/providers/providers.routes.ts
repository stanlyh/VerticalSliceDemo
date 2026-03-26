import { Routes } from '@angular/router';

export const PROVIDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./providers-list/providers-list.component').then(m => m.ProvidersListComponent),
    title: 'Proveedores'
  }
];
