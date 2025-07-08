import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { of, Observable } from 'rxjs';
import { UploadService } from '../../../../../shared/services/upload.service';
import { ProductItemCostStore } from '../../services/costs-store.service';
import { CostDetailType, ProductItemCostRequest } from '../../models/costs.model';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'app-cost-form-dialog',
    imports: [Dialog, ButtonModule, FileUploadModule, DropdownModule, DragDropModule, SkeletonModule, TextareaModule, SelectModule, FormsModule, ReactiveFormsModule, InputTextModule],

    templateUrl: './cost-form-dialog.component.html'
})
export class CostFormDialogComponent {
    private readonly store = inject(ProductItemCostStore);
    private readonly uploadService = inject(UploadService);

    list = this.store.list;
    fb = inject(NonNullableFormBuilder);
    // Imágenes
    documentFile: File | null = null;
    documentPreview: string | null = null;

    submitted = signal(false);
    costId = this.store.selectedCostId;
    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedCost = this.store.selectedCost;

    form: FormGroup<{
        [key in keyof ProductItemCostRequest]: FormControl<ProductItemCostRequest[key]>;
    }> = this.fb.group({
        type: this.fb.control<CostDetailType>(null as any, [Validators.required]),
        description: this.fb.control<string>('', [Validators.required]),
        amount: this.fb.control<number>(0, [Validators.required]),
        documentUrl: this.fb.control<string | null>(null)
    });

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);
            const product = this.selectedCost();
            console.log(product);
            if (product) {
                this.form.patchValue(product);

                // Cargar imágenes existentes (en caso de edición)
                this.documentPreview = product.documentUrl ?? '';
                this.documentFile = null;
            } else {
                this.form.reset();
                this.documentPreview = '';
                this.documentFile = null;
            }
        }
    });

    costTypes: { label: string; value: CostDetailType }[] = [
        { label: 'Envío', value: 'SHIPPING' },
        { label: 'Impuesto', value: 'TAX' },
        { label: 'Adicional', value: 'ADDITIONAL' },
        { label: 'Otro', value: 'OTHER' }
    ];

    submit() {
        this.submitted.set(false);
        if (this.form.invalid) return;

        const dto = this.form.getRawValue();

        const runUpload$: Observable<string | null> = this.documentFile ? this.uploadService.uploadAndGetFinalUrl$(this.documentFile) : of(this.documentPreview);

        runUpload$.subscribe({
            next: (url) => {
                const fullDto: ProductItemCostRequest = {
                    ...dto,
                    documentUrl: url
                };

                // Aquí debes pasar el ID del producto como parámetro, ya que eliminamos la dependencia circular
                const productId = this.store.selectedProductId(); // asegúrate que esté seteado antes de abrir el diálogo
                if (productId == null) {
                    console.error('No hay producto seleccionado');
                    return;
                }

                this.store.saveProduct(productId, fullDto);
            },
            error: () => {
                this.saving.set(false);
                this.submitted.set(false);
            }
        });
    }

    // manejo de documentos

    onDocumentSelected(event: any) {
        const file: File = event.files?.[0];

        if (file) {
            this.documentFile = file;

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.documentPreview = reader.result as string;
                };
                reader.readAsDataURL(file);
            } else {
                this.documentPreview = null; // PDF, no mostrar imagen
            }
        }
    }

    openPdfPreview() {
        if (this.documentPreview) {
            window.open(this.documentPreview, '_blank');
        }
    }

    removeDocument() {
        if (this.documentPreview) {
            // El documento viene del backend y debe eliminarse de R2
            this.store.markImageForDeletion({
                id: 0, // puedes usar 0 o null si no usas ID real para documentos únicos
                imageUrl: this.documentPreview
            });
            this.documentPreview = null;
        }

        this.documentFile = null;
        this.documentPreview = null;
        this.form.controls.documentUrl.setValue(null);
    }
    close() {
        this.store.closeDialog();
        this.form.reset();
        this.selectedCost.set(null);
    }
}
