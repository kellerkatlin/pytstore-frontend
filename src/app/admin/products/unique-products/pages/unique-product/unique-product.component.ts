import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';
import { UniqueProductDialogComponent } from '../../components/unique-product-dialog/unique-product-dialog.component';
import { UniqueProductStore } from '../../services/unique-product-store.service';
import { ProductItemStatus, UniqueProductResponse } from '../../models/unique-product.model';
import { PurchaseUniqueProductStore } from '../../services/purchase-unique-product-sotre.service';
import { PurchaseUniqueProductDialogComponent } from '../../components/purchase-unique-product-dialog/purchase-unique-product-dialog.component';
import { TooltipModule } from 'primeng/tooltip';
import { CostDetailDialogComponent } from '../../components/cost-detail-dialog/cost-detail-dialog.component';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-unique-product',
    imports: [CommonModule, TooltipModule, ProgressSpinnerModule, UniqueProductDialogComponent, PurchaseUniqueProductDialogComponent, ToolbarModule, TagModule, IconFieldModule, InputIconModule, ButtonModule, TableModule, CostDetailDialogComponent],
    templateUrl: './unique-product.component.html'
})
export class UniqueProductComponent {
    private readonly store = inject(UniqueProductStore);
    private readonly router = inject(Router);
    private readonly storePurchase = inject(PurchaseUniqueProductStore);
    private readonly confirmationService = inject(ConfirmationService);
    list = this.store.list;
    loading = this.store.loading;
    page = this.store.page;
    limit = this.store.limit;
    total = this.store.total;
    dialogOpen = this.store.dialogOpen;
    search = this.store.search;

    ngOnInit() {
        this.store.loadList(true);
    }

    openNew() {
        this.store.openDialog();
    }

    onEdit(productId: number) {
        this.store.openDialog(productId);
    }

    onPay(product: UniqueProductResponse) {
        this.storePurchase.openDialog(product);
    }

    onCosts(productId: number) {
        this.store.openDialogCost(productId);
    }

    onPageChange(event: any) {
        this.store.onPageChange(event);
    }

    onSearchChange(event: any) {
        this.store.onSearchChange(event.target.value);
    }

    get first(): number {
        return ((this.page() ?? 1) - 1) * (this.limit() ?? 10);
    }

    onProductDetail(productId: string) {
        this.router.navigate(['/seller/unique-product', productId]);
    }

    getStatusSeverity(status: ProductItemStatus): 'info' | 'success' | 'warning' | 'danger' | undefined {
        switch (status) {
            case 'NOT_AVAILABLE':
                return 'warning';
            case 'ORDERED':
                return 'info';
            case 'IN_STOCK':
                return 'success';
            case 'SOLD':
                return 'danger';
            default:
                return undefined;
        }
    }

    confirmArrival(productId: number) {
        this.confirmationService.confirm({
            message: '¿Confirmar que el producto llegó y está en stock?',
            header: 'Confirmar llegada',
            icon: 'pi pi-question-circle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.storePurchase.confirmProductArrival(productId);
            }
        });
    }

    remove(productId: number) {
        this.confirmationService.confirm({
            message: '¿Confirmar eliminacion de producto unico?',
            header: 'Confirmar eliminacion',
            icon: 'pi pi-question-circle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.remove(productId);
            }
        });
    }
}
