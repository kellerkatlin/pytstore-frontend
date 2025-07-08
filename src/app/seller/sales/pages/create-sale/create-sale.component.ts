import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UniqueProductDetailResponse } from '../../../unique-products/models/unique-product-detail';
import { UniqueProductService } from '../../../unique-products/service/unique-product.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { CustomerResponse } from '../../../../admin/users/customer/models/customer.model';
import { CustomerService } from '../../../../pages/service/customer.service';

@Component({
    selector: 'app-create-sale',
    imports: [ReactiveFormsModule, AutoComplete, DropdownModule, InputTextModule, TextareaModule, FileUploadModule, ButtonModule, CardModule, DividerModule, TableModule, CurrencyPipe, ConfirmDialogModule],
    templateUrl: './create-sale.component.html'
})
export class CreateSaleComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly uniqueProductService = inject(UniqueProductService);
    private readonly fb = inject(FormBuilder);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly customerService = inject(CustomerService);
    productDetail = signal<UniqueProductDetailResponse | null>(null);

    customerSuggestions: CustomerResponse[] = [];
    customerControl = new FormControl<CustomerResponse | null>(null);

    products = computed(() => {
        const product = this.productDetail();
        return product ? [product] : [];
    });
    selectedCustomer: CustomerResponse | null = null;
    saleForm!: FormGroup;

    paymentMethods = [
        { id: 1, name: 'Yape' },
        { id: 2, name: 'Plin' },
        { id: 3, name: 'Transferencia' },
        { id: 4, name: 'Efectivo' }
    ];

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.uniqueProductService.getUniqueProductDetail(id).subscribe({
                next: (res) => {
                    this.productDetail.set(res.data);
                }
            });
        }

        this.saleForm = this.fb.group({
            customerName: [''],
            customerPhone: [''],
            customerEmail: [''],
            addressLine: [''],

            district: [''],
            city: [''],
            paymentMethodId: [null, Validators.required]
        });

        this.customerControl.valueChanges.subscribe((customer) => {
            if (customer) {
                this.fillCustomerData(customer);
            }
        });
    }

    fillCustomerData(customer: CustomerResponse) {
        this.saleForm.patchValue({
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            addressLine: customer.addresses?.[0]?.addressLine ?? '',
            district: customer.addresses?.[0]?.district ?? ''
        });
    }

    searchCustomers(event: any) {
        const query = event.query;
        if (!query || query.length < 2) return;

        // this.customerService.searchCustomers(query).subscribe({
        //     next: (res: ApiResponse<CustomerResponse[]>) => {
        //         this.customerSuggestions = res.data;
        //     }
        // });
    }

    onCustomerSelected() {
        const c = this.selectedCustomer;

        this.saleForm.patchValue({
            customerName: c?.name,
            customerPhone: c?.phone,
            customerEmail: c?.email,
            addressLine: c?.addresses?.[0]?.addressLine ?? '',
            district: c?.addresses?.[0]?.district ?? ''
        });
    }

    onReceiptSelected(event: any) {
        const file = event.files?.[0] ?? null;
        this.saleForm.patchValue({ receipt: file });
    }
    handleNewCustomer(newCustomer: any) {
        this.selectedCustomer = newCustomer;
        this.onCustomerSelected();
    }
    submit() {
        if (this.saleForm.invalid) return;

        this.confirmationService.confirm({
            message: '¿Confirmas registrar esta venta?',
            accept: () => this.createSale()
        });
    }

    createSale() {
        const form = this.saleForm.value;
        const payload = {
            productItemId: this.productDetail()?.id,
            salePrice: this.productDetail()?.salePrice,
            customer: {
                name: form.customerName,
                phone: form.customerPhone,
                email: form.customerEmail,
                address: form.customerAddress
            },
            payment: {
                paymentMethodId: form.paymentMethodId,
                receiptUrl: 'url-simulada.jpg' // Aquí iría la URL del comprobante subido
            }
        };

        // Aquí simulas el llamado al backend
        console.log('Registrando venta con payload:', payload);
        this.messageService.add({ severity: 'success', summary: 'Venta registrada correctamente' });
    }

    openCreateCustomer() {
        // Lógica para abrir el modal (ej: ViewChild)
    }
}
