import { Component, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { WithdrawalStore } from '../../service/withdrawal-store.service';
import { WithdrawalStatus } from '../../model/withdrawal.model';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { Calendar } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-withdrawals',
    imports: [ToolbarModule, Calendar, FormsModule, DatePipe, TableModule, ButtonModule, CurrencyPipe, BadgeModule],
    templateUrl: './withdrawals.component.html'
})
export class WithdrawalsComponent {
    private readonly store = inject(WithdrawalStore);
    private readonly confirmationService = inject(ConfirmationService);
    list = this.store.list;
    loading = this.store.loading;
    page = this.store.page;
    limit = this.store.limit;
    total = this.store.total;
    dialogOpen = this.store.dialogOpen;
    startDate: string | null = null;
    endDate: string | null = null;

    ngOnInit() {
        this.store.loadList(true);
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
    approveWithdrawal(sellerId: number) {
        this.confirmationService.confirm({
            message: '¿Confirmar el retiro?',
            header: 'Confirmar retiro',
            icon: 'pi pi-question-circle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.updateStatus(sellerId, { status: 'APPROVED' });
            }
        });
    }

    rejectWitdrawal(sellerId: number) {
        this.confirmationService.confirm({
            message: '¿Rechazar el retiro?',
            header: 'Rechazar retiro',
            icon: 'pi pi-question-circle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.updateStatus(sellerId, { status: 'REJECTED' });
            }
        });
    }
}
