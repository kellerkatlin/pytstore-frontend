import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UploadService } from '../../../../shared/services/upload.service';
import { ProductItemCostService } from './costs.service';
import { ProductItemCostRequest, ProductItemCostResponse } from '../models/costs.model';

@Injectable({ providedIn: 'root' })
export class ProductItemCostStore {
    private readonly service = inject(ProductItemCostService);
    private readonly messageService = inject(MessageService);
    private readonly uploadService = inject(UploadService);
    private readonly imagesToDelete = signal<{ id: number; imageUrl: string }[]>([]);
    // Signals globales del módulo
    list = signal<ProductItemCostResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedCostId = signal<number | null>(null);
    selectedCost = signal<ProductItemCostResponse | null>(null);

    selectedProductId = signal<number | null>(null);
    // Cargar la lista inicial
    loadList(productId: number, showToast = false) {
        this.loading.set(true);
        this.selectedProductId.set(productId);
        this.service.findAll(productId).subscribe({
            next: (res) => {
                this.list.set(res.data);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Productos únicos cargados correctamente'
                    });
                }

                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({ severity: 'error', summary: 'Error al cargar productos' });
            }
        });
    }

    // Abrir el dialog
    openDialog(costId?: number) {
        this.selectedCostId.set(costId ?? null);
        this.dialogOpen.set(true);

        if (costId) {
            this.loadingDialog.set(true);
            this.service.get(this.selectedProductId()!, costId).subscribe({
                next: (res) => {
                    this.selectedCost.set(res.data);
                    this.loadingDialog.set(false);
                },
                error: () => {}
            });
        } else {
            this.selectedCostId.set(null);
            this.selectedCost.set(null);
        }
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedCostId.set(null);
    }

    // Guardar (crear o editar)
    saveProduct(productId: number, dto: ProductItemCostRequest) {
        this.saving.set(true);
        const costId = this.selectedCostId()!;

        const op$ = costId ? this.service.update(productId, costId, dto) : this.service.create(productId, dto);

        op$.subscribe({
            next: ({ data }) => {
                if (costId) {
                    this.list.update((current) => current.map((p) => (p.id === data.id ? data : p)));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Actualizado correctamente'
                    });
                    this.loadList(productId);
                } else {
                    this.list.update((current) => [...current, data]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado correctamente'
                    });
                    this.loadList(productId);
                }
                // 🔥 Eliminar imágenes de R2 si las hubiera
                const images = this.imagesToDelete();
                for (const img of images) {
                    this.uploadService.deleteFileByUrl$(img.imageUrl).subscribe();
                }
                this.imagesToDelete.set([]);

                this.closeDialog();
                this.saving.set(false);
            },
            error: () => {
                this.saving.set(false);
            }
        });
    }

    //manejo de imagenes eliminadas
    markImageForDeletion(image: { id: number; imageUrl: string }) {
        this.imagesToDelete.update((current) => [...current, image]);
    }

    deleteProduct(id: number) {
        this.service.delete(this.selectedProductId()!, id).subscribe({
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
