import { Component, effect, inject, signal } from '@angular/core';
import { SaleStore } from '../../service/sale-store.service';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaySaleDto } from '../../models/sale';
import { Dialog } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CurrencyPipe } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadService } from '../../../../../shared/services/upload.service';

@Component({
    selector: 'app-sale-pay-dialog',
    imports: [Dialog, FileUploadModule, SkeletonModule, InputTextModule, CurrencyPipe, ButtonModule, ReactiveFormsModule, SelectModule],
    templateUrl: './sale-pay-dialog.component.html'
})
export class SalePayDialogComponent {
    private readonly store = inject(SaleStore);
    private readonly uploadService = inject(UploadService);

    fb = inject(NonNullableFormBuilder);

    loadingDialog = this.store.loadingSalePayDialog;
    submitted = signal(false);

    payments = this.store.paymentMethods;
    selectedSale = this.store.selectedSale;
    dialogOpen = this.store.dialogPaySale;
    saving = this.store.savingSalePay;
    selectedSaleId = this.store.selectedSaleId;

    documentFile: File | null = null;
    documentPreview: string | null = null;

    form: FormGroup<{
        [key in keyof PaySaleDto]: FormControl<PaySaleDto[key]>;
    }> = this.fb.group({
        paymentMethodId: this.fb.control<number | null>(null, [Validators.required]),
        documentUrl: this.fb.control<string | null>(null)
    });

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);
            this.form.reset();
            this.documentFile = null;
            this.documentPreview = null;
        }
    });

    submit() {
        this.submitted.set(true);

        if (this.form.invalid || !this.documentFile) return;

        this.saving.set(true);

        this.uploadService.uploadAndGetFinalUrl$(this.documentFile).subscribe({
            next: (url) => {
                const dto: PaySaleDto = {
                    ...this.form.getRawValue(),
                    documentUrl: url
                };

                this.store.paySale(dto);
            },
            error: () => {
                this.saving.set(false);
                console.error('Error al subir el archivo');
            }
        });
    }

    onDocumentSelected(event: any) {
        const file: File = event.files?.[0];
        if (!file) return;

        this.documentFile = file;

        // Si es imagen, generamos vista previa
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                this.documentPreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        } else {
            this.documentPreview = null; // Es PDF, no previsualizar
        }
    }

    openPdfPreview() {
        if (this.documentFile) {
            const blobUrl = URL.createObjectURL(this.documentFile);
            window.open(blobUrl, '_blank');
        }
    }

    removeDocument() {
        this.documentFile = null;
        this.documentPreview = null;
        this.form.get('documentUrl')?.reset();
    }

    close() {
        this.store.closePaySaleDialog();
        this.form.reset();
        this.documentFile = null;
        this.documentPreview = null;
    }
}
