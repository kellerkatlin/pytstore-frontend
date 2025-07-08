import { Routes } from '@angular/router';
import { Dashboard } from '../pages/dashboard/dashboard';

export const adminRoutes: Routes = [
    {
        path: '',
        component: Dashboard
    },

    {
        path: 'products',
        loadChildren: () => import('./products/products.routes').then((p) => p.productsAdminRoutes)
    },

    {
        path: 'finances',
        loadChildren: () => import('./finance/finances.routes').then((f) => f.financesAdminRoutes)
    },
    {
        path: 'sales',
        loadChildren: () => import('./sales/sales.routes').then((s) => s.salesAdminRoutes)
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then((c) => c.usersAdminRoutes)
    }
];
