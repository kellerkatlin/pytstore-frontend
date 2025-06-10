import { catchError, firstValueFrom, of } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';

export function authInitializer(authService: AuthService) {
    return () => {
        return firstValueFrom(authService.me().pipe(catchError(() => of(null))));
    };
}
