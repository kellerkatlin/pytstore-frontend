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

@Component({
    selector: 'app-purchase-unique-product-dialog',
    imports: [Dialog, ButtonModule, DropdownModule, DragDropModule, SkeletonModule, TextareaModule, SelectModule, FormsModule, ReactiveFormsModule, InputTextModule],
    templateUrl: './purchase-unique-product-dialog.component.html'
})
export class PurchaseUniqueProductDialogComponent {
    private readonly store = inject(PurchaseUniqueProductStore);
    fb = inject(NonNullableFormBuilder);

    loadingDialog = this.store.loadingDialog;

    selectedProduct = this.store.selectedProduct;
    submitted = signal(false);
    saving = this.store.saving;
    dialogOpen = this.store.dialogOpen;
    unitCost = 0;

    form: FormGroup<{
        [key in keyof CreatePurchaseDto]: FormControl<CreatePurchaseDto[key]>;
    }> = this.fb.group({
        providerName: this.fb.control<string>('', [Validators.required]),
        invoiceCode: this.fb.control<string>('', [Validators.required]),
        purchaseDate: this.fb.control<string>(this.formatDate(new Date()), [Validators.required]),

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
        if (this.form.invalid || !this.selectedProduct()) return;

        const dto = this.form.getRawValue();

        dto.items = [
            {
                productItemId: +this.selectedProduct()!.id,
                unitCost: this.unitCost
            }
        ];

        this.store.savePurchase(dto);
    }

    onCostChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.unitCost = +input.value;
    }

    close() {
        this.store.closeDialog();
    }
}
