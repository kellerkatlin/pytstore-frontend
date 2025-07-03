import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SellerService } from './seller.service';
import { SellerRequest, SellerResponse } from '../models/seller.model';

@Injectable({ providedIn: 'root' })
export class SellerStore {
    private readonly service = inject(SellerService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<SellerResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedSellerId = signal<number | null>(null);
    selectedSeller = signal<SellerResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getSellers({
                page: this.page(),
                limit: this.limit(),
                search: this.search()
            })
            .subscribe({
                next: (res) => {
                    this.list.set(res.data.data);
                    this.total.set(res.data.meta.total);
                    if (showToast) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: res.message ?? 'Vendedores cargados correctamente'
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

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList();
    }

    // Abrir el dialog
    openDialog(seller?: SellerResponse) {
        this.selectedSeller.set(seller ?? null);
        this.dialogOpen.set(true);

        if (seller?.id) {
            this.loadingDialog.set(true);
            this.service.getSellerById(seller.id).subscribe({
                next: (res) => {
                    this.selectedSeller.set(res.data);
                    this.loadingDialog.set(false);
                },
                error: () => {
                    this.loadingDialog.set(false);
                    this.dialogOpen.set(false);
                }
            });
        } else {
            this.selectedSeller.set(null);
        }
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedSellerId.set(null);
    }

    saveSeller(dto: SellerRequest) {
        this.saving.set(true);
        const seller = this.selectedSeller();

        const op$ = seller ? this.service.updateSeller(+seller.user.id, dto) : this.service.createSeller(dto);

        op$.subscribe({
            next: (res) => {
                const { data } = res;
                if (seller?.id) {
                    this.list.update((current) => current.map((p) => (p.id === data.id ? data : p)));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Actualizado correctamente',
                        detail: res.message ?? ''
                    });
                    this.loadList();
                } else {
                    this.list.update((current) => [...current, data]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado correctamente',
                        detail: res.message ?? ''
                    });
                    this.loadList();
                }
                this.closeDialog();
                this.saving.set(false);
            },
            error: () => {
                this.saving.set(false);
            }
        });
    }

    deleteSeller(id: number) {
        this.service.deleteSeller(id).subscribe({
            next: () => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.messageService.add({ severity: 'success', summary: 'Eliminada correctamente' });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error al eliminar' });
            }
        });
    }
}
