import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TransactionDialogComponent } from '../../components/transaction-dialog/transaction-dialog.component';
import { CapitalStore } from '../../service/capital-store.service';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CapitalAccountName, CapitalType, TransactionResponse } from '../../models/capital.mode';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
@Component({
    selector: 'app-transactions',
    imports: [
        CommonModule,
        CardModule,
        CalendarModule,
        FormsModule,
        DropdownModule,
        ProgressSpinnerModule,
        TooltipModule,
        ToolbarModule,
        TagModule,
        BadgeModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        TableModule,
        TransactionDialogComponent
    ],

    templateUrl: './transactions.component.html'
})
export class TransactionsComponent {
    private readonly store = inject(CapitalStore);
    private readonly confirmationService = inject(ConfirmationService);

    summary = this.store.summary;
    list = this.store.list;
    loading = this.store.loading;
    page = this.store.page;
    limit = this.store.limit;
    total = this.store.total;
    dialogOpen = this.store.dialogOpen;
    search = this.store.search;

    INCOME_TYPES: CapitalType[] = ['INJECTION', 'SALE_PROFIT', 'TRANSFER_IN'];
    EXPENSE_TYPES: CapitalType[] = ['PURCHASE_EXPENSE', 'OPERATIONAL_EXPENSE', 'WITHDRAWAL', 'DEVOLUTION_COST', 'TRANSFER_OUT'];

    filters = {
        account: null as CapitalAccountName | null,
        type: null as CapitalType | null,
        startDate: null as Date | null,
        endDate: null as Date | null
    };

    capitalTypes = [
        { label: 'Todos', value: '' },
        { label: 'Ganancia venta', value: 'SALE_PROFIT' },
        { label: 'Compra', value: 'PURCHASE_EXPENSE' },
        { label: 'Gasto operativo', value: 'OPERATIONAL_EXPENSE' },
        { label: 'Costo devolución', value: 'DEVOLUTION_COST' },
        { label: 'Retiro', value: 'WITHDRAWAL' },
        { label: 'Transferencia in', value: 'TRANSFER_IN' },
        { label: 'Transferencia out', value: 'TRANSFER_OUT' }
    ];

    accountOptions = [
        { label: 'Caja', value: 'CASH' },
        { label: 'Inventario', value: 'INVENTORY' },
        { label: 'Comisiones', value: 'COMMISSIONS' }
    ];

    capitalTypeLabels: Record<CapitalType, string> = {
        INJECTION: 'Inyección de capital',
        SALE_PROFIT: 'Ganancia por venta',
        PURCHASE_EXPENSE: 'Compra de producto',
        OPERATIONAL_EXPENSE: 'Gasto operativo',
        DEVOLUTION_COST: 'Costo por devolución',
        WITHDRAWAL: 'Retiro',
        TRANSFER_IN: 'Transferencia recibida',
        TRANSFER_OUT: 'Transferencia enviada'
    };

    accountNameLabels: Record<CapitalAccountName, string> = {
        CASH: 'Caja',
        INVENTORY: 'Inventario',
        COMMISSIONS: 'Comisiones'
    };

    onFilterChange() {
        this.store.applyFilters({ ...this.filters });
    }

    ngOnInit() {
        this.store.loadList(true);
        this.store.loadSummary();
    }

    openNew() {
        this.store.openDialog();
    }

    onEdit() {
        this.store.openDialog();
    }

    formatDateTime(dateStr: string): string {
        const date = new Date(dateStr);

        return date.toLocaleString('es-PE', {
            timeZone: 'America/Lima',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    getSignedAmount(tx: TransactionResponse): number {
        const positiveCombinations = [
            { type: 'INJECTION', account: 'CASH' },
            { type: 'SALE_PROFIT', account: 'CASH' },
            { type: 'TRANSFER_IN', account: 'CASH' },
            { type: 'TRANSFER_IN', account: 'INVENTORY' },
            { type: 'TRANSFER_IN', account: 'COMMISSIONS' },
            { type: 'PURCHASE_EXPENSE', account: 'INVENTORY' }
        ];

        const isPositive = positiveCombinations.some((combo) => combo.type === tx.type && combo.account === tx.account.name);

        return isPositive ? tx.amount : -tx.amount;
    }

    getCapitalTypeLabel(type: CapitalType): string {
        return this.capitalTypeLabels[type];
    }

    getAccountTypeLabel(type: CapitalAccountName): string {
        return this.accountNameLabels[type];
    }

    onPageChange(event: any) {
        this.store.onPageChange(event);
    }

    onSearchChange(event: any) {
        this.store.onSearchChange(event.target.value);
    }

    get first(): number {
        return ((this.page() ?? 1) - 1) * (this.limit() ?? 10);
    }
}
