import { Routes } from '@angular/router';

export const salesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/create-sale/create-sale.component').then((m) => m.CreateSaleComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/create-sale/create-sale.component').then((m) => m.CreateSaleComponent)
    }
];
