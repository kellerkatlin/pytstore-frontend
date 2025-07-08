import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UniqueProductResponse } from '../models/unique-product.model';
import { PurchaseService } from '../../../inventory/purchases/service/purchase.service';
import { CreatePurchaseDto } from '../models/purchase-unique-product.model';
import { UniqueProductStore } from './unique-product-store.service';

@Injectable({ providedIn: 'root' })
export class PurchaseUniqueProductStore {
    private readonly service = inject(PurchaseService);
    private readonly messageService = inject(MessageService);
    private readonly storeUniqueProduct = inject(UniqueProductStore);
    // Signals globales del módulo

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedProduct = signal<UniqueProductResponse | null>(null);

    // Abrir el dialog

    openDialog(product: UniqueProductResponse) {
        this.selectedProduct.set(product);
        this.dialogOpen.set(true);
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedProduct.set(null);
    }

    // Guardar (crear o editar)
    savePurchase(dto: CreatePurchaseDto) {
        this.saving.set(true);

        this.service.createPurchaseUniqueProduct(dto).subscribe({
            next: ({ data }) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Creado correctamente'
                });
                this.storeUniqueProduct.loadList();
                this.closeDialog();
                this.saving.set(false);
            },
            error: () => {
                this.saving.set(false);
            }
        });
    }
    confirmProductArrival(productId: number) {
        this.service.confirmProductItemArrival(productId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Llego correctamente'
                });
                this.storeUniqueProduct.loadList();
                this.closeDialog();
                this.saving.set(false);
            }
        });
    }
}
