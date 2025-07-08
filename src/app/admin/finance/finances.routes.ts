import { Routes } from '@angular/router';

export const financesAdminRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./capital/page/transactions/transactions.component').then((m) => m.TransactionsComponent)
    }
];
