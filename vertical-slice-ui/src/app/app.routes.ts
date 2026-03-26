import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./features/clients/clients.routes').then(m => m.CLIENT_ROUTES)
  },
  {
    path: 'providers',
    loadChildren: () =>
      import('./features/providers/providers.routes').then(m => m.PROVIDER_ROUTES)
  },
  { path: '**', redirectTo: 'products' }
];
