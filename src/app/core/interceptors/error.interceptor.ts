import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const messageService = inject(MessageService);
    return next(req).pipe(
        catchError((error) => {
            const backendError = error?.error;

            const status = error.status;
            const msg = backendError?.message ?? 'Error inesperado del servidor';

            if (status === 401 && !router.url.startsWith('/auth/login')) {
                router.navigateByUrl('/auth/login');
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
