import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { WithdrawalRequest, WithdrawalResponse } from '../models/withdrawal.model';
import { WithDrawalService } from './withdrawal.service';
import { CommisionService } from './commision.service';
import { CommisionSummary } from '../models/commission.model';

@Injectable({ providedIn: 'root' })
export class CommissionStore {
    private readonly service = inject(WithDrawalService);
    private readonly commisionService = inject(CommisionService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<WithdrawalResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedWithdrawalId = signal<number | null>(null);
    selectedWithdrawal = signal<WithdrawalResponse | null>(null);

    myCommission = signal<CommisionSummary | null>(null);

    page = signal(1);
    limit = signal(10);
    total = signal(0);
    startDate = signal<string | null>(null);
    endDate = signal<string | null>(null);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getMyWithDrawal({
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

    closeDialog() {
        this.dialogOpen.set(false);
    }

    getMySummary() {
        this.commisionService.getMySummary().subscribe({
            next: (res) => {
                this.myCommission.set(res.data);
            },
            error: () => {}
        });
    }

    saveWithdrawal(dto: WithdrawalRequest) {
        this.saving.set(true);

        this.service.requestWithdrawal(dto).subscribe({
            next: (res) => {
                const { data } = res;
                this.list.update((current) => [...current, data]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Creado correctamente',
                    detail: res.message ?? ''
                });
                this.loadList();
                this.closeDialog();
                this.saving.set(false);
            },
            error: () => {
                this.saving.set(false);
            }
        });
    }
}
