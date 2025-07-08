import { Component, inject } from '@angular/core';
import { SaleDialogComponent } from '../../components/sale-dialog/sale-dialog.component';
import { SaleStore } from '../../service/sale-store.service';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { SalesQuery, SalesStatus } from '../../models/sale';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { SalePayDialogComponent } from '../../components/sale-pay-dialog/sale-pay-dialog.component';
import { CostFormDialogComponent } from '../../components/cost-form-dialog/cost-form-dialog.component';

@Component({
    selector: 'app-sales',
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        CalendarModule,
        TooltipModule,
        ProgressSpinnerModule,
        SaleDialogComponent,
        ToolbarModule,
        TagModule,
        BadgeModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        TableModule,
        SalePayDialogComponent,
        CostFormDialogComponent
    ],
    templateUrl: './sales.component.html'
})
export class SalesComponent {
    private readonly store = inject(SaleStore);
    private readonly confirmationService = inject(ConfirmationService);
    list = this.store.list;
    loading = this.store.loading;
    page = this.store.page;
    limit = this.store.limit;
    total = this.store.total;
    dialogOpen = this.store.dialogOpen;
    search = this.store.search;

    ngOnInit() {
        this.store.loadList(true);
    }

    filters = {} as SalesQuery;

    salesStatusOptions = [
        { label: 'Todos', value: '' },
        { label: 'Pendiente', value: 'PENDING' },
        { label: 'Aprobada', value: 'APPROVED' },
        { label: 'En proceso', value: 'IN_PROCESS' },
        { label: 'Pagada', value: 'PAID' },
        { label: 'Completada', value: 'COMPLETED' },
        { label: 'Cancelada', value: 'CANCELED' },
        { label: 'Reembolsada', value: 'REFUNDED' }
    ];

    openNew() {
        this.store.openDialog();
    }

    onFilterChange() {
        this.store.applyFilters({ ...this.filters });
    }

    onPageChange(event: any) {
        this.store.onPageChange(event);
    }

    SALE_STATUS_SEVERITY: Record<SalesStatus, 'success' | 'info' | 'warn' | 'danger' | 'contrast'> = {
        PENDING: 'info',
        PAID: 'contrast',
        APPROVED: 'success',
        IN_PROCESS: 'warn',
        COMPLETED: 'success',
        CANCELED: 'danger',
        REFUNDED: 'danger'
    };

    SALE_STATUS_LABELS_ES: Record<SalesStatus, string> = {
        PENDING: 'Pendiente',
        PAID: 'Pagada',
        APPROVED: 'Aprobada',
        IN_PROCESS: 'Preparación',
        COMPLETED: 'Completada',
        CANCELED: 'Cancelada',
        REFUNDED: 'Reembolsada'
    };

    getSaleStatusSeverity(status: SalesStatus) {
        return this.SALE_STATUS_SEVERITY[status] ?? 'info';
    }

    getSaleStatusLabel(status: SalesStatus) {
        return this.SALE_STATUS_LABELS_ES[status] ?? status;
    }

    getSaleActions(status: SalesStatus) {
        const actions: {
            icon: string;
            tooltip: string;
            severity: 'contrast' | 'success' | 'warn' | 'danger';
            onClick: (saleId: number) => void;
            label?: string;
        }[] = [];

        switch (status) {
            case 'PENDING':
                actions.push({
                    icon: 'pi pi-dollar',
                    tooltip: 'Marcar como Pagado',
                    severity: 'contrast',
                    onClick: this.paySale.bind(this)
                });
                break;

            case 'PAID':
                actions.push({
                    icon: 'pi pi-check',
                    tooltip: 'Aprobar Venta',
                    severity: 'success',
                    onClick: this.approveSale.bind(this)
                });
                break;

            case 'APPROVED':
                actions.push({
                    icon: 'pi pi-cog',
                    tooltip: 'Preparar Pedido',
                    severity: 'warn',
                    onClick: this.prepareSale.bind(this)
                });
                break;

            case 'IN_PROCESS':
                actions.push({
                    icon: 'pi pi-box',
                    tooltip: 'Completar Venta',
                    severity: 'success',
                    onClick: this.completeSale.bind(this)
                });
                break;
        }

        return actions;
    }

    onSearchChange(event: any) {
        this.store.onSearchChange(event.target.value);
    }

    get first(): number {
        return ((this.page() ?? 1) - 1) * (this.limit() ?? 10);
    }

    paySale(saleId: number) {
        this.store.openSalePayDialog(saleId);
    }

    approveSale(saleId: number) {
        this.store.openAproveSaleDialog(saleId);
    }

    prepareSale(saleId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea preparar esta venta?',
            header: 'Confirmar preparacion',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => this.store.prepareSale(saleId)
        });
    }

    completeSale(saleId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea completar esta venta?',
            header: 'Confirmar venta',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => this.store.completeSale(saleId)
        });
    }

    rejectSale(saleId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea desaprobar esta venta?',
            header: 'Confirmar desaprobación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.rejectSale(saleId);
            }
        });
    }
}
