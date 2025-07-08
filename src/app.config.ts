import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInitializer } from './app/core/initializers/auth.initializer';
import { AuthService } from './app/auth/service/auth.service';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authInterceptor } from './app/auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptorsFromDi(), withInterceptors([errorInterceptor, authInterceptor])),
        MessageService,
        ConfirmationService,
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        {
            provide: APP_INITIALIZER,
            useFactory: authInitializer,
            deps: [AuthService],
            multi: true
        }
    ]
};
