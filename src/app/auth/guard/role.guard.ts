import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { RoleName } from '../models/user.interface';

export function roleGuard(allowedRoles: RoleName[]): CanMatchFn {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);

        return auth.isAuthenticated() && auth.hasRole(allowedRoles) ? true : router.parseUrl('/notfound');
    };
}
