import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-login',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    email: string = '';
    loading: boolean = false;
    password: string = '';

    checked: boolean = false;

    login(): void {
        this.loading = true;
        this.authService.login(this.email, this.password).subscribe({
            next: (user) => {
                this.loading = false;

                switch (user.role) {
                    case 'SUPERADMIN':
                        this.router.navigate(['/']);
                        break;
                    case 'SELLER':
                        this.router.navigate(['/seller/unique-product']);
                        break;
                    default:
                        this.router.navigate(['/']);
                }
            },
            error: (error) => {
                console.error('Login failed:', error);
                this.loading = false;
            }
        });
    }
}
