import { Routes } from '@angular/router';

export const uniqueProductRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/unique-product-list/unique-product-list.component').then((m) => m.UniqueProductListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/unique-product-detail/unique-product-detail.component').then((m) => m.UniqueProductDetailComponent)
    }
];
