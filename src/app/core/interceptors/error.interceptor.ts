import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { Location } from '@angular/common';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const messageService = inject(MessageService);
    const location = inject(Location);

    return next(req).pipe(
        catchError((error) => {
            const backendError = error?.error;
            const status = error.status;
            const msg = backendError?.message ?? 'Error inesperado del servidor';
            const path = location.path();
            console.log(path);
            if (status === 401) {
                if (!path.startsWith('/auth/login')) {
                    authService.logout().subscribe(() => {
                        router.navigateByUrl('/auth/login', { replaceUrl: true });
                    });
                }
            } else if (status === 403) {
                router.navigateByUrl('/notfound');
            }

            messageService.add({
                severity: status >= 500 ? 'error' : 'warn',
                summary: `Error ${status}`,
                detail: msg,
                life: 5000
            });

            return throwError(() => backendError ?? error);
        })
    );
};
