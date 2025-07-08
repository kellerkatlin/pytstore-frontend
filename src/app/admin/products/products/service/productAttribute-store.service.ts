import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductResponse } from '../models/product.model';
import { ProductAttributeService } from './productAttribute.service';
import { AttributeResponse } from '../../attributes/models/attribute.model';
import { ProductAttributeResponse } from '../models/productAttribute.model';

@Injectable({ providedIn: 'root' })
export class ProductAttributeStore {
    private readonly service = inject(ProductAttributeService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<ProductAttributeResponse[]>([]);
    listUnassignProductAttribute = signal<AttributeResponse[]>([]);

    loading = signal(false);
    loadingUnassignProductAttribute = signal(false);

    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedProductId = signal<number | null>(null);
    selectedProduct = signal<ProductResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    pageUnassignProductAttribute = signal(1);
    limitUnassignProductAttribute = signal(10);
    searchUnassignProductAttribute = signal('');
    totalUnassignProductAttribute = signal(0);

    // Cargar la lista inicial

    loadList(productId: number, showToast = false) {
        this.selectedProductId.set(productId);

        this.loading.set(true);
        this.service.getAssignedAttributes(productId, { page: this.page(), limit: this.limit(), search: this.search() }).subscribe({
            next: (res) => {
                this.list.set(res.data.data);
                this.total.set(res.data.meta.total);
                this.loading.set(false);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Atributos cargados correctamente'
                    });
                }
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    loadListUnassignProductAttribute(categoryId: number, showToast = false) {
        this.loadingUnassignProductAttribute.set(true);
        this.service.getUnassignedAttributes(categoryId, { page: this.pageUnassignProductAttribute(), limit: this.limitUnassignProductAttribute(), search: this.searchUnassignProductAttribute() }).subscribe({
            next: (res) => {
                this.listUnassignProductAttribute.set(res.data.data);
                this.totalUnassignProductAttribute.set(res.data.meta.total);
                this.loadingUnassignProductAttribute.set(false);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Atributos cargados correctamente'
                    });
                }
            },
            error: () => {
                this.loadingUnassignProductAttribute.set(false);
            }
        });
    }
    onPageChange(event: { first: number; rows: number }) {
        const currentPage = event.first / event.rows + 1;
        this.page.set(currentPage);
        this.limit.set(event.rows);
        this.loadList(this.selectedProductId()!);
    }

    onDropdownOpen() {
        this.loadListUnassignProductAttribute(this.selectedProductId()!);
    }

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList(this.selectedProductId()!);
    }

    onSearchChangeAttributes(search: string) {
        this.searchUnassignProductAttribute.set(search);
        this.page.set(1);
        this.loadListUnassignProductAttribute(this.selectedProductId()!);
    }

    // Abrir el dialog
    openDialog(productId: number) {
        this.selectedProductId.set(productId);
        this.dialogOpen.set(true);
        this.loadList(productId, true);
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedProductId.set(null);
    }

    assignProductAttribute(id: number) {
        this.service.assignAttributeToProduct(this.selectedProductId()!, id).subscribe({
            next: () => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.loadList(this.selectedProductId()!);
                this.messageService.add({ severity: 'success', summary: 'Asignacion correctamente' });
            },
            error: () => {}
        });
    }

    unassignProductAttribute(id: number) {
        this.service.unassignAttributeFromProduct(this.selectedProductId()!, id).subscribe({
            next: () => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.loadList(this.selectedProductId()!);
                this.messageService.add({ severity: 'success', summary: 'Des asignado correctamente' });
            },
            error: () => {}
        });
    }
}
