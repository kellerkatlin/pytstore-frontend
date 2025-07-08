import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { BrandStore } from '../../service/brand-store.service';
import { BrandRequest, STATUS } from '../../models/brand.model';

@Component({
    selector: 'app-brand-dialog',
    imports: [Dialog, ButtonModule, SkeletonModule, TextareaModule, SelectModule, InputTextModule, ReactiveFormsModule],

    templateUrl: './brand-dialog.component.html'
})
export class BrandDialogComponent {
    private readonly store = inject(BrandStore);
    fb = inject(NonNullableFormBuilder);
    submitted = signal(false);

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedBrand = this.store.selectedBrand;

    status: { label: string; value: STATUS }[] = [
        { label: 'ACTIVO', value: 'ACTIVE' },
        { label: 'INACTIVO', value: 'INACTIVE' }
    ];

    form: FormGroup<{
        [key in keyof BrandRequest]: FormControl<BrandRequest[key]>;
    }> = this.fb.group({
        name: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
        status: this.fb.control<STATUS>('ACTIVE')
    });

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);

            const brand = this.selectedBrand();
            if (brand) {
                this.form.patchValue(brand);
            } else {
                this.form.reset();
            }
        }
    });

    submit() {
        this.submitted.set(true);

        if (this.form.invalid) return;

        const dto = this.form.getRawValue();

        this.store.saveBrand(dto);
    }

    close() {
        this.store.closeDialog();
    }
}
