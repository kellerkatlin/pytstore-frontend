import { Component } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../auth/service/auth.service';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, MenuModule, StyleClassModule, AppConfigurator],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container ">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="assets/images/logo.jpg" alt="logo" class="size-10 rounded-full" />
                <span>P&T Store</span>
            </a>
        </div>

        <div class="layout-topbar-actions ">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button  layout-topbar-action" (click)="profileMenu.toggle($event)" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout">
                <i class="pi pi-ellipsis-v "></i>
            </button>

            <p-menu #profileMenu [popup]="true" [model]="profileItems"></p-menu>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" (click)="profileMenu.toggle($event)">
                        <i class="pi pi-user"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(
        public layoutService: LayoutService,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly confirmationService: ConfirmationService
    ) {}

    profileItems: MenuItem[] = [
        {
            label: 'Cuenta',
            items: [
                // {
                //     label: 'Mi Perfil',
                //     icon: 'pi pi-user-edit',
                //     command: () => this.goToProfile()
                // },
                {
                    label: 'Cerrar sesión',
                    icon: 'pi pi-sign-out',
                    command: () => this.logout(),
                    styleClass: 'text-red-500'
                }
            ]
        }
    ];

    // goToProfile() {
    //     this.router.navigate(['/mi-perfil']);
    // }

    logout() {
        this.confirmationService.confirm({
            message: '¿Estás seguro que deseas cerrar sesión?',
            header: 'Cerrar sesión',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.authService.logout().subscribe({
                    next: () => {
                        this.router.navigate(['/auth/login']);
                    }
                });
            }
        });
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
