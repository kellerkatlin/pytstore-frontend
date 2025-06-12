import { Routes } from '@angular/router';

export const uniqueProductRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/unique-product-list/unique-product-list.component').then((m) => m.UniqueProductListComponent)
    }
];
