import { Injectable, inject, signal } from '@angular/core';
import { UniqueProductService } from '../services/unique-product.service';
import { MessageService } from 'primeng/api';
import { UniqueProductRequest, UniqueProductResponse } from '../models/unique-product.model';
import { ProductStore } from '../../products/service/product-store.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { ProductItemCostStore } from './costs-store.service';

@Injectable({ providedIn: 'root' })
export class UniqueProductStore {
    private readonly service = inject(UniqueProductService);
    private readonly messageService = inject(MessageService);
    private readonly storeCost = inject(ProductItemCostStore);
    private readonly uploadService = inject(UploadService);
    private readonly productStore = inject(ProductStore);
    private readonly imagesToDelete = signal<{ id: number; imageUrl: string }[]>([]);

    // Signals globales del módulo
    list = signal<UniqueProductResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    dialogOpenCost = signal(false);
    selectedProductId = signal<number | null>(null);
    selectedProduct = signal<UniqueProductResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getUniqueProducts({
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
    openDialog(productId?: number) {
        this.selectedProductId.set(productId ?? null);
        this.dialogOpen.set(true);
        this.productStore.loadList();

        if (productId) {
            this.loadingDialog.set(true);
            this.service.getUniqueProductById(productId).subscribe({
                next: (res) => {
                    this.selectedProduct.set(res.data);
                    this.loadingDialog.set(false);
                    console.log(this.selectedProduct());
                },
                error: () => {}
            });
        } else {
            this.selectedProduct.set(null);
        }
    }

    openDialogCost(productId: number) {
        this.selectedProductId.set(productId);
        this.dialogOpenCost.set(true);
        this.storeCost.loadList(productId);
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedProductId.set(null);
        this.loadList();
    }

    // Guardar (crear o editar)
    saveProduct(dto: UniqueProductRequest) {
        this.saving.set(true);
        const id = this.selectedProductId();

        const op$ = id ? this.service.updateUniqueProduct(id, dto) : this.service.createUniqueProduct(dto);

        op$.subscribe({
            next: ({ data }) => {
                if (id) {
                    this.list.update((current) => current.map((p) => (p.id === data.id ? data : p)));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Actualizado correctamente'
                    });
                    this.loadList();
                } else {
                    this.list.update((current) => [...current, data]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado correctamente'
                    });
                    this.loadList();
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

    remove(productId: number) {
        this.service.deleteUniqueProduct(productId).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'No aprobado ', detail: res.message ?? 'No aprobado' });
                this.loadList();
            },
            error: () => {}
        });
    }
}
