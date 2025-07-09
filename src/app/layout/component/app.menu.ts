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
            label: 'Dashboard   ',
            roles: [RoleName.SUPERADMIN],
            items: [{ label: 'Dashboard', roles: [RoleName.SUPERADMIN], icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-fw pi-users',
            roles: [RoleName.SUPERADMIN],
            items: [
                {
                    label: 'Administrar Usuarios',
                    icon: 'pi pi-fw pi-user-edit',
                    routerLink: ['/admin/users'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Solicitudes de Vendedores',
                    icon: 'pi pi-fw pi-id-card',
                    routerLink: ['/admin/seller-requests'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Vendedores',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/admin/users/sellers'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Clientes',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/admin/users/customers'],
                    roles: [RoleName.SUPERADMIN]
                }
            ]
        },
        {
            label: 'Productos',
            icon: 'pi pi-fw pi-tags',
            roles: [RoleName.SUPERADMIN, RoleName.SELLER],
            items: [
                {
                    label: 'Catálogo',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/admin/products'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Productos Únicos',
                    icon: 'pi pi-fw pi-mobile',
                    routerLink: ['/admin/products/unique-products'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Productos Únicos',
                    icon: 'pi pi-fw pi-mobile',
                    routerLink: ['/seller/unique-product'],

                    roles: [RoleName.SELLER]
                },
                {
                    label: 'Categorías',
                    icon: 'pi pi-fw pi-th-large',
                    routerLink: ['/admin/products/categories'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Marcas',
                    icon: 'pi pi-fw pi-star',
                    routerLink: ['/admin/products/brands'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Atributos',
                    icon: 'pi pi-fw pi-sliders-h',
                    routerLink: ['/admin/products/attributes'],
                    roles: [RoleName.SUPERADMIN]
                }
            ]
        },

        {
            label: 'Inventario',
            icon: 'pi pi-fw pi-database',
            roles: [RoleName.SUPERADMIN],
            items: [
                {
                    label: 'Movimientos de Stock',
                    icon: 'pi pi-fw pi-dollar',
                    routerLink: ['/inventory/movements'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Compras',
                    icon: 'pi pi-fw pi-shopping-cart',
                    routerLink: ['/purchases'],
                    roles: [RoleName.SUPERADMIN]
                }
            ]
        },

        {
            label: 'Ventas',
            icon: 'pi pi-fw pi-dollar',
            roles: [RoleName.SUPERADMIN, RoleName.SELLER],
            items: [
                {
                    label: 'Listado de Ventas',
                    icon: 'pi pi-fw pi-file',
                    routerLink: ['/admin/sales'],
                    roles: [RoleName.SUPERADMIN]
                },

                {
                    label: 'Comisiones',
                    icon: 'pi pi-fw pi-percentage',
                    routerLink: ['/sales/commissions'],
                    roles: [RoleName.SUPERADMIN]
                },
                // {
                //     label: 'Comisiones',
                //     icon: 'pi pi-fw pi-percentage',
                //     routerLink: ['/sales/commissions'],
                //     roles: [RoleName.SELLER]
                // },
                {
                    label: 'Solicitudes de Retiro',
                    icon: 'pi pi-fw pi-wallet',
                    routerLink: ['admin/sales/withdrawals'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Retiros',
                    icon: 'pi pi-fw pi-wallet',
                    routerLink: ['/seller/sales/withdrawals'],
                    roles: [RoleName.SELLER]
                }
            ]
        },
        {
            label: 'Finanzas',
            icon: 'pi pi-fw pi-credit-card',
            roles: [RoleName.SUPERADMIN],
            items: [
                {
                    label: 'Capital',
                    icon: 'pi pi-fw pi-chart-line',
                    routerLink: ['/admin/finances'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Gastos',
                    icon: 'pi pi-fw pi-minus-circle',
                    routerLink: ['/finance/expenses'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Métodos de Pago',
                    icon: 'pi pi-fw pi-money-bill',
                    routerLink: ['/finance/payment-methods'],
                    roles: [RoleName.SUPERADMIN]
                }
            ]
        },
        {
            label: 'Marketing',
            icon: 'pi pi-fw pi-bullhorn',
            roles: [RoleName.SUPERADMIN],
            items: [
                {
                    label: 'Cupones',
                    icon: 'pi pi-fw pi-ticket',
                    routerLink: ['/marketing/coupons'],
                    roles: [RoleName.SUPERADMIN]
                },
                {
                    label: 'Promociones',
                    icon: 'pi pi-fw pi-gift',
                    routerLink: ['/marketing/promotions'],
                    roles: [RoleName.SUPERADMIN]
                }
            ]
        },
        {
            label: 'Envíos',
            icon: 'pi pi-fw pi-truck',
            roles: [RoleName.SUPERADMIN],
            items: [
                {
                    label: 'Gestión de envíos',
                    icon: 'pi pi-fw pi-send',
                    routerLink: ['/logistics/shipments'],
                    roles: [RoleName.SUPERADMIN]
                }
            ]
        },

        {
            label: 'Configuración',
            icon: 'pi pi-fw pi-cog',
            routerLink: ['/settings'],
            roles: [RoleName.SUPERADMIN]
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
