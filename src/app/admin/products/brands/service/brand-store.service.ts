import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BrandRequest, BrandResponse } from '../models/brand.model';
import { BrandService } from './brand.service';

@Injectable({ providedIn: 'root' })
export class BrandStore {
    private readonly service = inject(BrandService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<BrandResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedBrandId = signal<number | null>(null);
    selectedBrand = signal<BrandResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getBrands({
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
                            detail: res.message ?? 'Marcas cargados correctamente'
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

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList();
    }

    // Abrir el dialog
    openDialog(BrandId?: number) {
        this.selectedBrandId.set(BrandId ?? null);
        this.dialogOpen.set(true);

        if (BrandId) {
            this.loadingDialog.set(true);
            this.service.getBrandById(BrandId).subscribe({
                next: (res) => {
                    this.selectedBrand.set(res.data);
                    this.loadingDialog.set(false);
                },
                error: () => {
                    this.loadingDialog.set(false);
                    this.dialogOpen.set(false);
                }
            });
        } else {
            this.selectedBrand.set(null);
        }
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedBrandId.set(null);
    }

    saveBrand(dto: BrandRequest) {
        this.saving.set(true);
        const id = this.selectedBrandId();

        const op$ = id ? this.service.updateBrand(id, dto) : this.service.createBrand(dto);

        op$.subscribe({
            next: (res) => {
                const { data } = res;
                if (id) {
                    this.list.update((current) => current.map((p) => (p.id === data.id ? data : p)));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Actualizado correctamente',
                        detail: res.message ?? ''
                    });
                } else {
                    this.list.update((current) => [...current, data]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado correctamente',
                        detail: res.message ?? ''
                    });
                }
                this.closeDialog();
                this.saving.set(false);
            },
            error: () => {
                this.saving.set(false);
            }
        });
    }

    deleteBrand(id: number) {
        this.service.deleteBrand(id).subscribe({
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
