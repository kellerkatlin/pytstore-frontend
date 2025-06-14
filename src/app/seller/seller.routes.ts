import { Routes } from '@angular/router';
import { Dashboard } from '../pages/dashboard/dashboard';

export const sellerRoutes: Routes = [
    {
        path: '',
        component: Dashboard
    },

    {
        path: 'products',
        loadComponent: () => import('./products/pages/product-list/product-list.component').then((m) => m.ProductListComponent)
    },
    {
        path: 'unique-product',
        loadChildren: () => import('./unique-products/unique-product.routes').then((m) => m.uniqueProductRoutes)
    },
    {
        path: 'sales',
        loadChildren: () => import('./sales/sales.routes').then((m) => m.salesRoutes)
    }
];
