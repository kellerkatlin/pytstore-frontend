import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryStore } from '../../service/category-store.service';
import { CategoryRequest, STATUS } from '../../models/category.model';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-category-dialog',
    imports: [Dialog, ButtonModule, SkeletonModule, TextareaModule, SelectModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './category-dialog.component.html'
})
export class CategoryDialogComponent {
    private readonly store = inject(CategoryStore);
    fb = inject(NonNullableFormBuilder);

    loadingDialog = this.store.loadingDialog;
    submitted = signal(false);

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedCategory = this.store.selectedCategory;

    status: { label: string; value: STATUS }[] = [
        { label: 'ACTIVO', value: 'ACTIVE' },
        { label: 'INACTIVO', value: 'INACTIVE' }
    ];

    form: FormGroup<{
        [key in keyof CategoryRequest]: FormControl<CategoryRequest[key]>;
    }> = this.fb.group({
        name: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
        status: this.fb.control<STATUS>('ACTIVE')
    });

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);

            const category = this.selectedCategory();
            if (category) {
                this.form.patchValue(category);
            } else {
                this.form.reset();
            }
        }
    });

    submit() {
        this.submitted.set(true);

        if (this.form.invalid) return;

        const dto = this.form.getRawValue();

        this.store.saveCategory(dto);
    }

    close() {
        this.store.closeDialog();
    }
}
