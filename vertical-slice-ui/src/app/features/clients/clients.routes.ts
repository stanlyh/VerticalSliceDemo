import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./clients-list/clients-list.component').then(m => m.ClientsListComponent),
    title: 'Clientes'
  }
];
