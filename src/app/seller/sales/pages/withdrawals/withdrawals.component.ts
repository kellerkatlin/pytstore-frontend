import { Component, inject } from '@angular/core';
import { WithDrawalStore } from '../../services/withdrawal-store.service';
import { ConfirmationService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
import { WithdrawalDialogComponent } from '../../components/withdrawal-dialog/withdrawal-dialog.component';
import { WithdrawalStatus } from '../../models/withdrawal.model';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { CommissionStore } from '../../services/commision-store.service';

@Component({
    selector: 'app-withdrawals',
    imports: [ToolbarModule, CardModule, ButtonModule, BadgeModule, CalendarModule, FormsModule, TableModule, CurrencyPipe, WithdrawalDialogComponent],
    templateUrl: './withdrawals.component.html'
})
export class WithdrawalsComponent {
    private readonly store = inject(WithDrawalStore);
    private readonly commisionStore = inject(CommissionStore);
    private readonly confirmationService = inject(ConfirmationService);
    list = this.store.list;
    loading = this.store.loading;
    page = this.store.page;
    limit = this.store.limit;
    total = this.store.total;
    dialogOpen = this.store.dialogOpen;
    startDate: string | null = null;
    endDate: string | null = null;

    myCommission = this.commisionStore.myCommission;

    ngOnInit() {
        this.store.loadList(true);
        this.commisionStore.getMySummary();
    }

    WITHDRAWAL_STATUS_SEVERITY: Record<WithdrawalStatus, 'success' | 'info' | 'warn' | 'danger'> = {
        PENDING: 'info',
        APPROVED: 'success',
        REJECTED: 'danger',
        CANCELED: 'warn'
    };

    WITHDRAWAL_STATUS_LABEL_ES: Record<WithdrawalStatus, string> = {
        PENDING: 'Pendiente',
        APPROVED: 'Aprobada',
        REJECTED: 'Rechazada',
        CANCELED: 'Cancelada'
    };

    getWithdrawalStatusSeverity(status: WithdrawalStatus) {
        return this.WITHDRAWAL_STATUS_SEVERITY[status] ?? 'info';
    }

    getWithdrawalStatusLabel(status: WithdrawalStatus) {
        return this.WITHDRAWAL_STATUS_LABEL_ES[status] ?? status;
    }

    openNew() {
        this.store.openDialog();
    }

    onFilterChange() {
        this.store.updateDateRange(this.startDate, this.endDate);
    }

    onPageChange(event: any) {
        this.store.onPageChange(event);
    }

    get first(): number {
        return ((this.page() ?? 1) - 1) * (this.limit() ?? 10);
    }
}
