import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { SellerStore } from '../../services/seller-store.service';
import { PasswordModule } from 'primeng/password';
import { SellerRequest } from '../../models/seller.model';
@Component({
    selector: 'app-seller-dialog',
    imports: [Dialog, ButtonModule, PasswordModule, SkeletonModule, TextareaModule, SelectModule, InputTextModule, ReactiveFormsModule],

    templateUrl: './seller-dialog.component.html'
})
export class SellerDialogComponent {
    private readonly store = inject(SellerStore);
    fb = inject(NonNullableFormBuilder);
    submitted = signal(false);

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedSeller = this.store.selectedSeller;

    form = this.fb.group({
        email: this.fb.control<string>('', [Validators.required, Validators.email]),
        password: this.fb.control<string | null>(null, !this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]),
        name: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
        storeName: this.fb.control<string | null>(null),
        phone: this.fb.control<string | null>(null),
        businessName: this.fb.control<string | null>(null),
        ruc: this.fb.control<string | null>(null, [Validators.pattern(/^\d{8}$|^\d{11}$/)]),
        description: this.fb.control<string | null>(null),
        logoUrl: this.fb.control<string | null>(null)
    });

    get isEditMode(): boolean {
        return !!this.selectedSeller(); // true si estás editando
    }

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);

            const seller = this.selectedSeller();
            if (seller) {
                this.form.patchValue({
                    ...seller,
                    email: seller.user.email ?? '',
                    name: seller.user.name ?? '',
                    phone: seller.user.phone ?? ''
                });
            } else {
                this.form.reset();
            }
        }
    });

    submit() {
        this.submitted.set(true);

        if (this.form.invalid) return;

        const form = this.form.getRawValue();

        const payload: SellerRequest = {
            email: form.email ?? '',
            password: form.password ?? null,
            phone: form.phone === '' ? null : form.phone,
            name: form.name ?? '',
            storeName: form.storeName ?? null,
            businessName: form.businessName ?? null,
            ruc: form.ruc ?? null,
            description: form.description ?? null,
            logoUrl: form.logoUrl === '' ? null : form.logoUrl
        };

        this.store.saveSeller(payload);
    }

    getFormControl(group: AbstractControl, controlName: string): FormControl {
        const control = (group as FormGroup).get(controlName);
        if (!control || !(control instanceof FormControl)) {
            throw new Error(`Control '${controlName}' no encontrado o no es FormControl`);
        }
        return control;
    }

    close() {
        this.store.closeDialog();
    }
}
