import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalResponse, WithdrawalStatus } from '../model/withdrawal.model';

@Injectable({ providedIn: 'root' })
export class WithdrawalStore {
    private readonly service = inject(WithdrawalService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<WithdrawalResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedWithdrawalId = signal<number | null>(null);
    selectedWithdrawal = signal<WithdrawalResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    total = signal(0);
    startDate = signal<string | null>(null);
    endDate = signal<string | null>(null);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getWithdrawal({
                page: this.page(),
                limit: this.limit(),
                startDate: this.startDate() ?? undefined,
                endDate: this.endDate() ?? undefined
            })
            .subscribe({
                next: (res) => {
                    this.list.set(res.data.data);
                    this.total.set(res.data.meta.total);
                    if (showToast) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: res.message ?? 'Retiros cargados correctamente'
                        });
                    }

                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                }
            });
    }

    onPageChange(event: { first: number; rows: number }) {
        this.page.set(event.first + 1);
        this.limit.set(event.rows);
        this.loadList();
    }

    // Abrir el dialog
    openDialog() {
        this.dialogOpen.set(true);
    }

    updateDateRange(start: string | null, end: string | null) {
        this.startDate.set(start);
        this.endDate.set(end);
        this.page.set(1);
        this.loadList();
    }

    updateStatus(id: number, dto: { status: WithdrawalStatus }) {
        this.service.updateStatus(id, dto).subscribe({
            next: () => {
                this.loadList();
            }
        });
    }

    closeDialog() {
        this.dialogOpen.set(false);
    }
}
