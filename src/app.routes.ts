import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/auth/guard/auth.guard';
import { roleGuard } from './app/auth/guard/role.guard';
import { RoleName } from './app/auth/models/user.interface';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard, roleGuard([RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.SELLER, RoleName.RECRUITER, RoleName.STOCK, RoleName.MARKETING])],
        children: [{ path: '', component: Dashboard }]
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/auth/auth.routes').then((m) => m.authRoutes)
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
