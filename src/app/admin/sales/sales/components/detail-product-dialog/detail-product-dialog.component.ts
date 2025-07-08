import { Component, inject } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { SaleStore } from '../../service/sale-store.service';
import { CurrencyPipe } from '@angular/common';
import { PaymentMethodService } from '../../../../../shared/services/payment-methods.service';

@Component({
    selector: 'app-detail-product-dialog',
    imports: [Dialog, CurrencyPipe],
    templateUrl: './detail-product-dialog.component.html'
})
export class DetailProductDialogComponent {
    private readonly store = inject(SaleStore);
    productDetail = this.store.productDetail;
    displayInfoDialog = this.store.dialogDetailProducts;

    close() {
        this.store.closeDetailProductDialog();
    }
}
