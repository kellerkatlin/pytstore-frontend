import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { UploadService } from '../../../../../shared/services/upload.service';
import { SaleStore } from '../../service/sale-store.service';
import { CostDetailType } from '../../models/cost';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-cost-form-dialog',
    imports: [Dialog, FileUploadModule, SelectModule, SkeletonModule, InputTextModule, CurrencyPipe, ButtonModule, ReactiveFormsModule, SelectModule],

    templateUrl: './cost-form-dialog.component.html'
})
export class CostFormDialogComponent {
    private readonly store = inject(SaleStore);
    private readonly uploadService = inject(UploadService);

    fb = inject(NonNullableFormBuilder);

    loadingDialog = this.store.loadingAproveDialog;
    submitted = signal(false);

    selectedSale = this.store.selectedSale;
    dialogOpen = this.store.dialogAproveSale;
    saving = this.store.savingAproveSale;
    selectedSaleId = this.store.selectedSaleId;

    costPreviews: { file: File | null; preview: string | null }[] = [];

    costTypes: { label: string; value: CostDetailType }[] = [
        { label: 'Envío', value: 'SHIPPING' },
        { label: 'Impuesto', value: 'TAX' },
        { label: 'Adicional', value: 'ADDITIONAL' },
        { label: 'Otro', value: 'OTHER' }
    ];

    form: FormGroup = this.fb.group({
        additionalCosts: this.fb.array<FormGroup>([])
    });

    createCostFormGroup(): FormGroup {
        return this.fb.group({
            type: this.fb.control<CostDetailType>('SHIPPING'), // valor por defecto
            description: this.fb.control(''),
            amount: this.fb.control(0),
            documentUrl: this.fb.control<string | null>(null)
        });
    }

    get additionalCosts(): FormArray<FormGroup> {
        return this.form.get('additionalCosts') as FormArray<FormGroup>;
    }

    addCost() {
        this.additionalCosts.push(
            this.fb.group({
                type: this.fb.control<CostDetailType>('SHIPPING'),
                description: this.fb.control(''),
                amount: this.fb.control(0),
                documentUrl: this.fb.control<string | null>(null)
            })
        );
    }

    removeCost(index: number) {
        this.additionalCosts.removeAt(index);
        this.costPreviews.splice(index, 1); // si estás manejando previews de archivos también
    }

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);
            this.form.reset();
            this.costPreviews = [];
        }
    });

    submit() {
        this.submitted.set(true);

        if (this.form.invalid) return;

        this.saving.set(true);

        const dto = this.form.getRawValue();

        const uploadTasks = this.costPreviews.map((preview, index) => {
            const file = preview?.file;
            if (file) {
                return firstValueFrom(this.uploadService.uploadAndGetFinalUrl$(file)).then((url) => {
                    // Asignamos la URL en el form (para mantenerlo sincronizado)
                    this.additionalCosts.at(index).get('documentUrl')?.setValue(url);
                    // También modificamos el objeto DTO directamente (opcional si usas el form en vez del dto)
                    dto.additionalCosts![index].documentUrl = url;
                });
            }
            return Promise.resolve(); // No hay archivo, no hacemos nada
        });

        Promise.all(uploadTasks)
            .then(() => {
                // Ahora todos los documentUrl están cargados y listos
                this.store.approveSale(this.selectedSaleId()!, dto); // cast si estás seguro de la forma
            })
            .catch(() => {
                this.saving.set(false);
                console.error('Error al subir uno o más documentos');
            });
    }

    onAdditionalDocumentSelected(event: any, index: number) {
        const file: File = event.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            this.costPreviews[index] = {
                file,
                preview: file.type.startsWith('image/') ? (reader.result as string) : null
            };
        };
        reader.readAsDataURL(file);

        this.additionalCosts.at(index).get('documentUrl')?.setValue(null);
    }

    openAdditionalPreview(index: number) {
        const preview = this.costPreviews[index]?.preview;
        if (preview) window.open(preview, '_blank');
    }

    removeAdditionalDocument(index: number) {
        this.costPreviews[index] = { file: null, preview: null };
        this.additionalCosts.at(index).get('documentUrl')?.setValue(null);
    }

    resetAll() {
        this.form.reset();
        this.additionalCosts.clear();
        this.costPreviews = [];
        this.submitted.set(false);
    }

    close() {
        this.resetAll();
        this.store.closeAproveDialog();
    }
}
