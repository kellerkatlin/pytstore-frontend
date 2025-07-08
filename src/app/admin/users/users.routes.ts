import { Routes } from '@angular/router';

export const usersAdminRoutes: Routes = [
    {
        path: 'sellers',
        loadComponent: () => import('./seller/pages/sellers/sellers.component').then((m) => m.SellersComponent)
    },
    {
        path: 'customers',
        loadComponent: () => import('./customer/pages/customers').then((m) => m.Customers)
    }
];
