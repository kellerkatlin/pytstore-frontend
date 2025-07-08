import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { CustomerStore } from '../../services/customer-store.service';
import { CustomerRequest, CustomerType } from '../../models/customer.model';

@Component({
    selector: 'app-customer-dialog',
    imports: [Dialog, ButtonModule, SkeletonModule, TextareaModule, SelectModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './customer-dialog.component.html'
})
export class CustomerDialogComponent {
    private readonly store = inject(CustomerStore);
    fb = inject(NonNullableFormBuilder);
    submitted = signal(false);

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedCustomer = this.store.selectedCustomer;

    form = this.fb.group({
        name: this.fb.control('', [Validators.required, Validators.minLength(3)]),
        dni: this.fb.control<string | null>(null, [Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]),
        ruc: this.fb.control<string | null>(null, [Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d{11}$/)]),
        customerType: this.fb.control<CustomerType | null>(null),
        email: this.fb.control<string | null>(null, [Validators.email]),
        phone: this.fb.control('', [Validators.required]),
        addresses: this.fb.array([
            this.fb.group({
                addressLine: this.fb.control('', [Validators.required]),
                district: this.fb.control(''),
                department: this.fb.control(''),
                province: this.fb.control(''),
                reference: this.fb.control('')
            })
        ])
    });

    get addresses(): FormArray {
        return this.form.get('addresses') as FormArray;
    }

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);

            const brand = this.selectedCustomer();
            if (brand) {
                this.form.patchValue(brand);
            } else {
                this.form.reset();
            }
        }
    });

    submit() {
        this.submitted.set(true);
        console.log(this.form.getRawValue());
        if (this.form.invalid) return;

        const { customerType, dni, ruc, ...rest } = this.form.getRawValue();

        const dto: CustomerRequest = {
            ...rest,
            customerType,
            dni: customerType === 'NATURAL' ? dni : null,
            ruc: customerType === 'JURIDICAL' ? ruc : null,
            addresses: rest.addresses.map((a) => ({
                ...a,
                phone: rest.phone
            }))
        };

        this.store.saveCustomer(dto);
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
