import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UniqueProductDetailResponse } from '../../../unique-products/models/unique-product-detail';
import { UniqueProductService } from '../../../unique-products/service/unique-product.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
    selector: 'app-create-sale',
    imports: [ReactiveFormsModule, DropdownModule, InputTextModule, TextareaModule, FileUploadModule, ButtonModule, CardModule, DividerModule, TableModule, CurrencyPipe, ConfirmDialogModule],
    templateUrl: './create-sale.component.html'
})
export class CreateSaleComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly uniqueProductService = inject(UniqueProductService);
    private readonly fb = inject(FormBuilder);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    productDetail = signal<UniqueProductDetailResponse | null>(null);

    products = computed(() => {
        const product = this.productDetail();
        return product ? [product] : [];
    });
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
            customerName: ['', Validators.required],
            customerPhone: [''],
            customerEmail: [''],
            paymentMethodId: [null, Validators.required],
            addressLine: ['', Validators.required],
            district: [''],
            city: ['']
        });
    }

    onReceiptSelected(event: any) {
        const file = event.files?.[0] ?? null;
        this.saleForm.patchValue({ receipt: file });
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
}
