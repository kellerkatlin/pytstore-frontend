import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { AttributeValueStore } from '../../service/attributeValue-store.service';
import { AttributeValueRequest } from '../../models/attributeValue.model';

@Component({
    selector: 'app-attribute-value-dialog',
    imports: [Dialog, ButtonModule, SkeletonModule, TextareaModule, SelectModule, InputTextModule, ReactiveFormsModule],

    templateUrl: './attribute-value-dialog.component.html'
})
export class AttributeValueDialogComponent {
    private readonly store = inject(AttributeValueStore);
    fb = inject(NonNullableFormBuilder);
    submitted = signal(false);

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;

    saving = this.store.saving;
    selectedAttribute = this.store.selectedAttribute;

    form: FormGroup<{
        [key in keyof AttributeValueRequest]: FormControl<AttributeValueRequest[key]>;
    }> = this.fb.group({
        value: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
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
