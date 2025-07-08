import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl, Validators, FormsModule, FormArray } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { SaleStore } from '../../service/sale-store.service';
import { ProductItem, SaleItem, SaleRequest, SalesType } from '../../models/sale';
import { DropdownModule } from 'primeng/dropdown';
import { CustomerStore } from '../../../../users/customer/services/customer-store.service';
import { SellerStore } from '../../../../users/seller/services/seller-store.service';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { CurrencyPipe } from '@angular/common';
import { DetailProductDialogComponent } from '../detail-product-dialog/detail-product-dialog.component';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
    selector: 'app-sale-dialog',
    imports: [
        Dialog,
        ChipModule,
        TagModule,
        CurrencyPipe,
        CardModule,
        ButtonModule,
        PanelModule,
        InputIconModule,
        IconFieldModule,
        PanelModule,
        PaginatorModule,
        ButtonModule,
        DropdownModule,
        SkeletonModule,
        TextareaModule,
        SelectModule,
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        DividerModule,
        DetailProductDialogComponent
    ],
    styles: `
        ::ng-deep .p-dialog {
            max-height: none !important;
        }
    `,
    templateUrl: './sale-dialog.component.html'
})
export class SaleDialogComponent {
    private readonly store = inject(SaleStore);
    private readonly customerStore = inject(CustomerStore);
    private readonly sellerStore = inject(SellerStore);

    fb = inject(NonNullableFormBuilder);
    submitted = signal(false);

    customers = this.customerStore.list;
    loadingCutomers = this.customerStore.loading;
    search = this.store.searchProducts;
    sellers = this.sellerStore.list;
    loadingSellers = this.sellerStore.loading;
    loadingDialog = this.store.loadingDialog;

    products = this.store.listProducts;
    loadingProducts = this.store.loadingProducts;
    limit = this.store.limitProducts;
    total = this.store.totalProducts;
    page = this.store.pageProducts;
    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedBrand = this.store.selectedSale;

    selectedItems: ProductItem[] = [];

    form: FormGroup = this.fb.group({
        customerId: this.fb.control<number>(0, [Validators.required]),
        userId: this.fb.control<number>(0, [Validators.required]),
        referralCode: this.fb.control<string | null>(null),
        type: this.fb.control<SalesType | null>(null),
        notes: this.fb.control<string | null>(null),
        items: this.fb.array<FormGroup>([this.createItemGroup()])
    });

    createItemGroup(): FormGroup {
        return this.fb.group({
            productId: this.fb.control<number>(0, [Validators.required]),
            variantId: this.fb.control<number | null>(null),
            productItemId: this.fb.control<number | null>(null),
            quantity: this.fb.control<number>(1, [Validators.required, Validators.min(1)]),
            salePrice: this.fb.control<number>(0, [Validators.required, Validators.min(0)])
        });
    }

    syncSelectedItemsToForm(): void {
        const itemsFormArray = this.form.get('items') as FormArray;

        itemsFormArray.clear();

        this.selectedItems.forEach((item) => {
            const group = this.fb.group({
                productId: this.fb.control(item.productId ?? 0, Validators.required),
                variantId: this.fb.control(item.type === 'VARIANT' ? item.id : null),
                productItemId: this.fb.control(item.type === 'UNIQUE' ? item.id : null),
                quantity: this.fb.control(item.quantity, [Validators.required, Validators.min(1)]),
                salePrice: this.fb.control(item.salePrice, [Validators.required, Validators.min(0)])
            });

            itemsFormArray.push(group);
        });
    }

    get first(): number {
        return ((this.page() ?? 1) - 1) * (this.limit() ?? 5);
    }

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);
            this.form.reset();
            this.selectedItems = [];
        }
    });

    onFilterCustomers(event: { filter: string }) {
        const query = event.filter?.trim() ?? '';

        this.customerStore.onSearchChange(query);
    }

    addToList(item: ProductItem): void {
        const itemKey = `${item.id}-${item.type}`;
        const existingItem = this.selectedItems.find((si) => `${si.id}-${si.type}` === itemKey);

        if (existingItem) {
            if (existingItem.quantity + 1 <= item.stock) {
                existingItem.quantity += 1;
            } else {
                alert(`Stock insuficiente para "${item.name}". Máximo permitido: ${item.stock}`);
            }
        } else {
            if (item.stock > 0) {
                this.selectedItems.push({ ...item, quantity: 1 });
            } else {
                alert(`El producto "${item.name}" no tiene stock disponible.`);
            }
        }
    }

    increaseQuantity(item: ProductItem): void {
        if (item.quantity < item.stock) {
            item.quantity++;
        } else {
            alert(`Stock insuficiente para ${item.name}`);
        }
    }

    decreaseQuantity(item: ProductItem): void {
        if (item.quantity > 1) {
            item.quantity--;
        }
    }

    getTotalQuantity(): number {
        return this.selectedItems.reduce((sum, si) => sum + si.quantity, 0);
    }

    getTotalAmount(): number {
        return this.selectedItems.reduce((sum, si) => sum + si.salePrice * si.quantity, 0);
    }

    onQuantityChange(item: ProductItem): void {
        if (item.quantity > item.stock) {
            item.quantity = item.stock;
            alert(`Stock máximo alcanzado para ${item.name}`);
        } else if (item.quantity < 1) {
            item.quantity = 1;
        }
    }

    removeFromList(item: ProductItem & { quantity: number }) {
        const keyToRemove = `${item.id}-${item.type}`;
        this.selectedItems = this.selectedItems.filter((si) => `${si.id}-${si.type}` !== keyToRemove);
    }

    onFilterSellers(event: { filter: string }) {
        const query = event.filter?.trim() ?? '';

        this.sellerStore.onSearchChange(query);
    }

    onDropdownCustomer() {
        this.customerStore.loadList();
    }
    onDropdownSeller() {
        this.sellerStore.loadList();
    }

    onPageChange(event: any) {
        this.store.onPageChangeProducts(event);
    }

    onSearchChange(event: any) {
        this.store.onSearchProductsChange(event.target.value);
    }

    showProductInfo(product: any) {
        this.store.openDialogDetailProduct(product);
    }

    submit() {
        this.submitted.set(true);
        this.syncSelectedItemsToForm();
        if (this.form.invalid) return;

        const dto = this.form.getRawValue();

        this.store.saveSale(dto);
    }

    close() {
        this.store.closeDialog();
        this.form.reset();
    }
}
