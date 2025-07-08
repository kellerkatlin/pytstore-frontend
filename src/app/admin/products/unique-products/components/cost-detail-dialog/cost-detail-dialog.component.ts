import { Component, inject } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductItemCostStore } from '../../services/costs-store.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CurrencyPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { UniqueProductStore } from '../../services/unique-product-store.service';
import { CostFormDialogComponent } from '../cost-form-dialog/cost-form-dialog.component';
import { CostDetailType } from '../../models/costs.model';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-cost-detail-dialog',
    imports: [Dialog, SkeletonModule, IconFieldModule, CurrencyPipe, TagModule, InputIconModule, ToolbarModule, ButtonModule, TableModule, CostFormDialogComponent],
    templateUrl: './cost-detail-dialog.component.html'
})
export class CostDetailDialogComponent {
    private readonly store = inject(ProductItemCostStore);
    private readonly uniqueProductStore = inject(UniqueProductStore);
    private readonly confirmationService = inject(ConfirmationService);
    dialogOpen = this.uniqueProductStore.dialogOpenCost;
    loadingDialog = this.uniqueProductStore.loadingDialog;
    list = this.store.list;
    loading = this.store.loading;

    openNew() {
        this.store.openDialog();
    }

    getCostTypeLabel(type: CostDetailType): string {
        const labels: Record<CostDetailType, string> = {
            SHIPPING: 'Envío',
            TAX: 'Impuesto',
            ADDITIONAL: 'Adicional',
            OTHER: 'Otro'
        };
        return labels[type] ?? type;
    }

    onEdit(costId: number) {
        this.store.openDialog(costId);
    }

    onDelete(costId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea eliminar este costo?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.deleteProduct(costId);
            }
        });
    }
}
