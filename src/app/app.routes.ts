import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component')
  },
  {
    path: 'create-register',
    loadComponent: () => import('./features/create-register/create-register.component')
  },
  {
    path: 'edit-register/:id',
    loadComponent: () => import('./features/create-register/create-register.component')
  }
];
