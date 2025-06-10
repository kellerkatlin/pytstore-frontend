import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { RoleName } from '../../auth/models/user.interface';
import { AuthService } from '../../auth/service/auth.service';

export interface AppMenuItem extends MenuItem {
    roles: RoleName[];
    items?: AppMenuItem[];
}
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    private readonly authService = inject(AuthService);
    model: MenuItem[] = [];

    private readonly fullModel: AppMenuItem[] = [
        {
            label: 'Home',
            roles: [RoleName.SUPERADMIN],
            items: [{ label: 'Dashboard', roles: [RoleName.SUPERADMIN, RoleName.SELLER], icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
        },
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/'],
            roles: [RoleName.SUPERADMIN, RoleName.SELLER]
        },
        {
            label: 'Gestión de Productos',
            icon: 'pi pi-fw pi-box',
            routerLink: ['/products'],
            roles: [RoleName.STOCK, RoleName.SUPERADMIN]
        },
        {
            label: 'UI Components',
            roles: [RoleName.SUPERADMIN, RoleName.SELLER],
            items: [
                { label: 'Form Layout', roles: [RoleName.SUPERADMIN, RoleName.SELLER], icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                { label: 'Input', roles: [RoleName.SUPERADMIN, RoleName.SELLER], icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] }
            ]
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            roles: [RoleName.SUPERADMIN, RoleName.SELLER],
            items: [
                {
                    roles: [RoleName.SUPERADMIN, RoleName.SELLER],
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/landing']
                },
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    roles: [RoleName.SUPERADMIN, RoleName.SELLER],
                    items: [
                        {
                            roles: [RoleName.SUPERADMIN, RoleName.SELLER],
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            routerLink: ['/auth/login']
                        },
                        {
                            roles: [RoleName.SUPERADMIN, RoleName.SELLER],
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            routerLink: ['/auth/error']
                        },
                        {
                            roles: [RoleName.SUPERADMIN, RoleName.SELLER],
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            routerLink: ['/auth/access']
                        }
                    ]
                },
                {
                    roles: [RoleName.SUPERADMIN, RoleName.SELLER],
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: ['/pages/crud']
                },
                {
                    roles: [RoleName.ADMIN, RoleName.SELLER],
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    routerLink: ['/pages/notfound']
                },
                {
                    roles: [RoleName.ADMIN, RoleName.SELLER],
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    routerLink: ['/pages/empty']
                }
            ]
        },
        {
            label: 'Get Started',
            roles: [RoleName.ADMIN, RoleName.SELLER],
            items: [
                {
                    roles: [RoleName.ADMIN, RoleName.SELLER],
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-book',
                    routerLink: ['/documentation']
                },
                {
                    roles: [RoleName.ADMIN, RoleName.SELLER],
                    label: 'View Source',
                    icon: 'pi pi-fw pi-github',
                    url: 'https://github.com/primefaces/sakai-ng',
                    target: '_blank'
                }
            ]
        }
    ];

    ngOnInit() {
        const role = this.authService.currentUser?.role;
        if (!role) {
            this.model = [];
            return;
        }
        this.model = this.filterMenuByRole(this.fullModel, role);
    }

    private filterMenuByRole(items: AppMenuItem[], role: RoleName | undefined): AppMenuItem[] {
        return items
            .filter((item) => !item.roles || (role && item.roles.includes(role)))
            .map((item) => ({
                ...item,
                items: item.items ? this.filterMenuByRole(item.items, role) : undefined
            }))
            .filter((item) => !item.items || item.items.length > 0 || item.routerLink);
    }
}
