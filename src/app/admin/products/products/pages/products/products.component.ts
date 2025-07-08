import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ProductStore } from '../../service/product-store.service';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';
import { ImageProduct } from '../../models/product.model';
import { ConfirmationService } from 'primeng/api';
import { ProductAttributeStore } from '../../service/productAttribute-store.service';
import { AssignAttributeDialogComponent } from '../../components/assign-attribute-dialog/assign-attribute-dialog.component';

@Component({
    selector: 'app-products',
    imports: [CommonModule, ProgressSpinnerModule, ToolbarModule, TagModule, IconFieldModule, InputIconModule, ButtonModule, TableModule, ProductDialogComponent, AssignAttributeDialogComponent],

    templateUrl: './products.component.html'
})
export class ProductsComponent {
    private readonly store = inject(ProductStore);
    private readonly router = inject(Router);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly storeProductAttribute = inject(ProductAttributeStore);

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

    onAssignAttributes(productId: number) {
        this.storeProductAttribute.openDialog(productId);
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

    getImage(image: ImageProduct[]): string | undefined {
        const primary = image.find((i) => i.isPrimary === true);
        return primary?.imageUrl;
    }

    onDelete(brandId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea eliminar este producto?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.deleteProduct(brandId);
            }
        });
    }

    //TODO PROXIMAMENTE
    // onProductDetail(productId: string) {
    //     this.router.navigate(['/seller/unique-product', productId]);
    // }
}
