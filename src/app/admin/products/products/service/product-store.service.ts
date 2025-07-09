import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductService } from './product.service';
import { ProductRequest, ProductResponse } from '../models/product.model';
import { UploadService } from '../../../../shared/services/upload.service';
import { CategoryStore } from '../../categories/service/category-store.service';

@Injectable({ providedIn: 'root' })
export class ProductStore {
    private readonly service = inject(ProductService);
    private readonly messageService = inject(MessageService);
    private readonly uploadService = inject(UploadService);
    private readonly imagesToDelete = signal<{ id: number; imageUrl: string }[]>([]);
    // Signals globales del módulo
    list = signal<ProductResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedProductId = signal<number | null>(null);
    selectedProduct = signal<ProductResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getProducts({
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
                            detail: 'Productos cargados correctamente'
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

    getAttributeValueTree(productId: number) {}

    // Abrir el dialog
    openDialog(productId?: number) {
        this.selectedProductId.set(productId ?? null);
        this.dialogOpen.set(true);

        if (productId) {
            this.loadingDialog.set(true);
            this.service.getProductById(productId).subscribe({
                next: (res) => {
                    this.selectedProduct.set(res.data);
                    this.loadingDialog.set(false);
                    console.log('Producto cargado:', this.selectedProduct());
                },
                error: () => {}
            });
        } else {
            this.selectedProduct.set(null);
        }
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedProductId.set(null);
    }

    saveProduct(dto: ProductRequest) {
        this.saving.set(true);
        const id = this.selectedProductId();

        const op$ = id ? this.service.updateProduct(id, dto) : this.service.createProduct(dto);

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

    markImageForDeletion(image: { id: number; imageUrl: string }) {
        this.imagesToDelete.update((current) => [...current, image]);
    }

    deleteProduct(id: number) {
        this.service.deleteProduct(id).subscribe({
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
