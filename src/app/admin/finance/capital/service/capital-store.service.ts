import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CapitalTransactionQuery, CreateTransaction, TransactionResponse } from '../models/capital.mode';
import { CapitalService } from './capital.service';

@Injectable({ providedIn: 'root' })
export class CapitalStore {
    private readonly service = inject(CapitalService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<TransactionResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedBrandId = signal<number | null>(null);
    selectedBrand = signal<TransactionResponse | null>(null);
    filters = signal<CapitalTransactionQuery>({});

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        const query = this.buildQueryFromFilters({
            page: this.page(),
            limit: this.limit(),
            ...this.filters()
        });

        this.service.getAllTransactions(query).subscribe({
            next: (res) => {
                this.list.set(res.data.data);
                this.total.set(res.data.meta.total);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: res.message ?? 'Transacciones cargados correctamente'
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
        const currentPage = event.first / event.rows + 1;
        this.page.set(currentPage);
        this.limit.set(event.rows);
        this.loadList();
    }

    applyFilters(newFilters: CapitalTransactionQuery) {
        this.filters.set(newFilters);
        this.page.set(1);
        this.loadList();
    }

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList();
    }

    // Abrir el dialog
    openDialog() {
        this.dialogOpen.set(true);
    }

    closeDialog() {
        this.dialogOpen.set(false);
    }

    saveTransaction(dto: CreateTransaction) {
        this.saving.set(true);

        this.service.createTrasaction(dto).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Actualizado correctamente',
                    detail: 'Transaccion creada con exito'
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

    private buildQueryFromFilters(filters: any): any {
        const result: Record<string, any> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;

            // Convierte Date a string ISO si aplica
            if (value instanceof Date) {
                result[key] = value.toISOString();
            } else {
                result[key] = value;
            }
        });

        return result;
    }
}
