import { Routes } from '@angular/router';

export const salesAdminRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./sales/pages/sales/sales.component').then((m) => m.SalesComponent)
    },
    {
        path: 'withdrawals',
        loadComponent: () => import('./withdrawal/pages/withdrawals/withdrawals.component').then((w) => w.WithdrawalsComponent)
    }
];
