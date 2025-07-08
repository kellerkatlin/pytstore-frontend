import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductResponse } from '../models/product.model';
import { ProductAttributeService } from './productAttribute.service';
import { ProductAttributeResponse } from '../models/productAttribute.model';
import { AttributeValueResponse } from '../../attributes/models/attributeValue.model';
import { ProductAttributeStore } from './productAttribute-store.service';

@Injectable({ providedIn: 'root' })
export class ProductValuesAttributeStore {
    private readonly service = inject(ProductAttributeService);
    private readonly messageService = inject(MessageService);
    // Signals globales del módulo
    list = signal<ProductAttributeResponse[]>([]);
    listUnassignProductValuesAttribute = signal<AttributeValueResponse[]>([]);

    loading = signal(false);
    loadingUnassignProductValuesAttribute = signal(false);

    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedProductId = signal<number | null>(null);
    selectedProduct = signal<ProductResponse | null>(null);
    selectedAttributeId = signal<number | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    pageUnassignProductValuesAttribute = signal(1);
    limitUnassignProductValuesAttribute = signal(10);
    searchUnassignProductValuesAttribute = signal('');
    totalUnassignProductValuesAttribute = signal(0);

    // Cargar la lista inicial

    loadList(productId: number, attributeId: number, showToast = false) {
        this.selectedProductId.set(productId);
        this.selectedAttributeId.set(attributeId);

        this.loading.set(true);
        this.service.getAssignedAttributeValues(productId, attributeId, { page: this.page(), limit: this.limit(), search: this.search() }).subscribe({
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

    loadListUnassignProductAttribute(productId: number, attributeId: number, showToast = false) {
        this.loadingUnassignProductValuesAttribute.set(true);
        this.service.getUnassignedValues(productId, attributeId, { page: this.pageUnassignProductValuesAttribute(), limit: this.limitUnassignProductValuesAttribute(), search: this.searchUnassignProductValuesAttribute() }).subscribe({
            next: (res) => {
                this.listUnassignProductValuesAttribute.set(res.data.data);
                this.totalUnassignProductValuesAttribute.set(res.data.meta.total);
                this.loadingUnassignProductValuesAttribute.set(false);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Valores cargados correctamente'
                    });
                }
            },
            error: () => {
                this.loadingUnassignProductValuesAttribute.set(false);
            }
        });
    }
    onPageChange(event: { first: number; rows: number }) {
        const currentPage = event.first / event.rows + 1;
        this.page.set(currentPage);
        this.limit.set(event.rows);
        this.loadList(this.selectedProductId()!, this.selectedAttributeId()!);
    }

    onDropdownOpen() {
        this.loadListUnassignProductAttribute(this.selectedProductId()!, this.selectedAttributeId()!);
    }

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList(this.selectedProductId()!, this.selectedAttributeId()!);
    }

    onSearchChangeAttributes(search: string) {
        this.searchUnassignProductValuesAttribute.set(search);
        this.page.set(1);
        this.loadListUnassignProductAttribute(this.selectedProductId()!, this.selectedAttributeId()!);
    }

    // Abrir el dialog
    openDialog(productId: number, attributeId: number) {
        this.dialogOpen.set(true);
        this.loadList(productId, attributeId, true);
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedProductId.set(null);
    }

    assignProductValueAttribute(id: number) {
        this.service.assignValuesToAttribute(this.selectedProductId()!, this.selectedAttributeId()!, id).subscribe({
            next: () => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.loadList(this.selectedProductId()!, this.selectedAttributeId()!);
                this.messageService.add({ severity: 'success', summary: 'Asignacion correctamente' });
            },
            error: () => {}
        });
    }

    unassignProductAttribute(id: number) {
        this.service.unassigValuesFromAttribute(this.selectedProductId()!, this.selectedAttributeId()!, id).subscribe({
            next: () => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.loadList(this.selectedProductId()!, this.selectedAttributeId()!);
                this.messageService.add({ severity: 'success', summary: 'Des asignado correctamente' });
            },
            error: () => {}
        });
    }
}
