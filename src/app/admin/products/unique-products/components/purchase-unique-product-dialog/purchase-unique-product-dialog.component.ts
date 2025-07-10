import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { PurchaseUniqueProductStore } from '../../services/purchase-unique-product-sotre.service';
import { CreatePurchaseDto } from '../../models/purchase-unique-product.model';
import { UploadService } from '../../../../../shared/services/upload.service';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'app-purchase-unique-product-dialog',
    imports: [Dialog, ButtonModule, DropdownModule, FileUploadModule, DragDropModule, SkeletonModule, TextareaModule, SelectModule, FormsModule, ReactiveFormsModule, InputTextModule],
    templateUrl: './purchase-unique-product-dialog.component.html'
})
export class PurchaseUniqueProductDialogComponent {
    private readonly store = inject(PurchaseUniqueProductStore);
    private readonly uploadService = inject(UploadService);

    fb = inject(NonNullableFormBuilder);

    loadingDialog = this.store.loadingDialog;

    selectedProduct = this.store.selectedProduct;
    submitted = signal(false);
    saving = this.store.saving;
    dialogOpen = this.store.dialogOpen;
    unitCost = 0;

    documentFile: File | null = null;
    documentPreview: string | null = null;

    form: FormGroup<{
        [key in keyof CreatePurchaseDto]: FormControl<CreatePurchaseDto[key]>;
    }> = this.fb.group({
        providerName: this.fb.control<string>('', [Validators.required]),
        invoiceCode: this.fb.control<string>('', [Validators.required]),
        purchaseDate: this.fb.control<string>(this.formatDate(new Date()), [Validators.required]),
        documentUrl: this.fb.control<string | null>(null),

        items: this.fb.control<
            {
                productItemId: number;
                unitCost: number;
            }[]
        >([])
    });

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }

    submit() {
        this.submitted.set(false);
        console.log(this.form.getRawValue());

        if (this.form.invalid || !this.documentFile) return;

        const dto = this.form.getRawValue();

        dto.items = [
            {
                productItemId: +this.selectedProduct()!.id,
                unitCost: this.unitCost
            }
        ];

        this.uploadService.uploadAndGetFinalUrl$(this.documentFile).subscribe({
            next: (url) => {
                const finalDto = {
                    ...dto,
                    documentUrl: url
                };

                this.store.savePurchase(finalDto);
            },
            error: () => {
                this.saving.set(false);
                console.error('Error al subir el archivo');
            }
        });
    }

    onCostChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.unitCost = +input.value;
    }

    close() {
        this.store.closeDialog();
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
}
