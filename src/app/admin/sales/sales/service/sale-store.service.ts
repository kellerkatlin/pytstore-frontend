import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SaleService } from './sale.service';
import { PaySaleDto, ProductItem, SaleRequest, SaleResponse, SalesQuery } from '../models/sale';
import { ProductStore } from '../../../products/products/service/product-store.service';
import { UniqueProductStore } from '../../../products/unique-products/services/unique-product-store.service';
import { PaymentMethodService } from '../../../../shared/services/payment-methods.service';
import { PaymentMethodResponse } from '../../../../shared/models/payment-method.model';
import { SaleCostRequest } from '../models/cost';

@Injectable({ providedIn: 'root' })
export class SaleStore {
    private readonly service = inject(SaleService);
    private readonly productStore = inject(ProductStore);
    private readonly uniqueProductStore = inject(UniqueProductStore);
    private readonly messageService = inject(MessageService);
    private readonly paymentMethodService = inject(PaymentMethodService);

    // Signals globales del módulo
    list = signal<SaleResponse[]>([]);

    listUniqueProducts = this.uniqueProductStore.list;
    loadingUniqueProducts = this.uniqueProductStore.loading;

    filters = signal<SalesQuery>({});
    loading = signal(false);
    loadingDialog = signal(false);
    loadingSalePayDialog = signal(false);
    loadingAproveDialog = signal(false);
    saving = signal(false);
    savingSalePay = signal(false);
    savingAproveSale = signal(false);
    dialogOpen = signal(false);
    selectedSaleId = signal<number | null>(null);
    selectedSale = signal<SaleResponse | null>(null);

    dialogDetailProducts = signal(false);
    dialogPaySale = signal(false);
    dialogAproveSale = signal(false);

    listProducts = signal<ProductItem[]>([]);
    productDetail = signal<ProductItem | null>(null);
    loadingProducts = signal(false);
    pageProducts = signal(1);
    limitProducts = signal(6);
    searchProducts = signal('');
    totalProducts = signal(0);

    paymentMethods = signal<PaymentMethodResponse[]>([]);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        const query = this.buildQueryFromFilters({
            page: this.page(),
            limit: this.limit(),
            ...this.filters()
        });

        this.service.getSales(query).subscribe({
            next: (res) => {
                this.list.set(res.data.data);
                this.total.set(res.data.meta.total);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: res.message ?? 'Ventas cargadas correctamente'
                    });
                }

                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    // cargar los metodos de pago
    paymentList() {
        this.paymentMethodService.getMethodPayments().subscribe({
            next: (res) => {
                this.paymentMethods.set(res.data);
            }
        });
    }

    loadProducts(showToast = false) {
        this.loadingProducts.set(true);

        this.service.searchItems({ page: this.pageProducts(), limit: this.limitProducts(), search: this.searchProducts() }).subscribe({
            next: (res) => {
                this.listProducts.set(res.data.data);
                this.totalProducts.set(res.data.meta.total);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: res.message ?? 'Produductos buscados'
                    });
                }

                this.loadingProducts.set(false);
            },
            error: () => {
                this.loadingProducts.set(false);
            }
        });
    }

    onPageChange(event: { first: number; rows: number }) {
        const currentPage = event.first / event.rows + 1;
        this.page.set(currentPage);
        this.limit.set(event.rows);
        this.loadList();
    }

    onPageChangeProducts(event: { first: number; rows: number }) {
        const currentPage = event.first / event.rows + 1;
        this.pageProducts.set(currentPage);
        this.limitProducts.set(event.rows);
        this.loadProducts();
    }

    applyFilters(newFilters: SalesQuery) {
        this.filters.set(newFilters);
        this.page.set(1);
        this.loadList();
    }

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList();
    }

    onSearchProductsChange(search: string) {
        this.searchProducts.set(search);
        this.pageProducts.set(1);
        this.loadProducts();
    }

    // Abrir el dialog
    openDialog() {
        this.dialogOpen.set(true);
        this.loadProducts();
    }

    openDialogDetailProduct(product: ProductItem) {
        this.dialogDetailProducts.set(true);
        this.productDetail.set(product);
    }

    openAproveSaleDialog(saleId: number) {
        this.dialogAproveSale.set(true);
        this.selectedSaleId.set(saleId);
        this.service.getSaleById(saleId).subscribe({
            next: (res) => {
                this.selectedSale.set(res.data);
            }
        });
    }

    openSalePayDialog(saleId: number) {
        this.dialogPaySale.set(true);
        this.selectedSaleId.set(saleId);
        this.service.getSaleById(saleId).subscribe({
            next: (res) => {
                this.selectedSale.set(res.data);
            }
        });
        this.paymentList();
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedSaleId.set(null);
    }

    closePaySaleDialog() {
        this.dialogPaySale.set(false);
        this.selectedSaleId.set(null);
    }

    closeAproveDialog() {
        this.dialogAproveSale.set(false);
        this.selectedSaleId.set(null);
    }

    closeDetailProductDialog() {
        this.dialogDetailProducts.set(false);
        this.productDetail.set(null);
    }

    saveSale(dto: SaleRequest) {
        this.saving.set(true);

        this.service.createSale(dto).subscribe({
            next: (res) => {
                const { data } = res;

                this.list.update((current) => [...current, data]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Creado correctamente',
                    detail: res.message ?? ''
                });
                this.loadList();
                this.closeDialog();
                this.saving.set(false);
            },
            error: () => {
                this.saving.set(false);
            }
        });
    }

    paySale(dto: PaySaleDto) {
        this.savingSalePay.set(true);

        this.service.paySale(this.selectedSaleId()!, dto).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Creado correctamente',
                    detail: res.message ?? ''
                });
                this.loadList();
                this.closePaySaleDialog();
                this.savingSalePay.set(false);
            },
            error: () => {
                this.savingSalePay.set(false);
            }
        });
    }

    prepareSale(saleId: number) {
        this.service.prepareSale(saleId).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'En curso ', detail: res.message ?? 'En curso' });
                this.loadList();
            },
            error: () => {}
        });
    }

    completeSale(saleId: number) {
        this.service.completeSale(saleId).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Completado ', detail: res.message ?? 'Completado' });
                this.loadList();
            },
            error: () => {}
        });
    }

    rejectSale(id: number) {
        this.service.rejectSale(id).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'No aprobado ', detail: res.message ?? 'No aprobado' });
                this.loadList();
            },
            error: () => {}
        });
    }

    approveSale(id: number, dto: SaleCostRequest) {
        this.savingAproveSale.set(true);
        this.service.appoveSale(id, dto).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Aprobada correctamente', detail: res.message ?? 'Aprobado correctamente' });
                this.loadList();
                this.closeAproveDialog();
                this.savingAproveSale.set(false);
            },
            error: () => {
                this.savingAproveSale.set(false);
            }
        });
    }

    private buildQueryFromFilters(filters: any): any {
        const result: Record<string, any> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;

            // Convierte Date a string ISO si aplica
            if (value instanceof Date) {
                result[key] = value.toISOString();
            } else {
                result[key] = value;
            }
        });

        return result;
    }
}
