import { Routes } from '@angular/router';
import { publicGuard } from '../core/guard/public.guard';

export const authRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                canActivate: [publicGuard],
                loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
            }
        ]
    }
];
