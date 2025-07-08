import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { STATUS, AttributeRequest } from '../../models/attribute.model';
import { AttributeStore } from '../../service/attribute-store.service';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-attribute-dialog',
    imports: [Dialog, ButtonModule, SkeletonModule, TextareaModule, SelectModule, InputTextModule, ReactiveFormsModule],

    templateUrl: './attribute-dialog.component.html'
})
export class AttributeDialogComponent {
    private readonly store = inject(AttributeStore);
    fb = inject(NonNullableFormBuilder);
    submitted = signal(false);

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedAttribute = this.store.selectedAttribute;

    status: { label: string; value: STATUS }[] = [
        { label: 'ACTIVO', value: 'ACTIVE' },
        { label: 'INACTIVO', value: 'INACTIVE' }
    ];

    form: FormGroup<{
        [key in keyof AttributeRequest]: FormControl<AttributeRequest[key]>;
    }> = this.fb.group({
        name: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
        status: this.fb.control<STATUS>('ACTIVE')
    });

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);
            const attribute = this.selectedAttribute();
            if (attribute) {
                this.form.patchValue(attribute);
            } else {
                this.form.reset();
            }
        }
    });

    submit() {
        this.submitted.set(true);

        if (this.form.invalid) return;

        const dto = this.form.getRawValue();

        this.store.saveAttribute(dto);
    }

    close() {
        this.store.closeDialog();
    }
}
