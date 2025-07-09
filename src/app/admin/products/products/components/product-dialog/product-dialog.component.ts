import { NgFor } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { switchMap, of, forkJoin } from 'rxjs';
import { ProductStore } from '../../service/product-store.service';
import { UploadService } from '../../../../../shared/services/upload.service';
import { ProductRequest, STATUS } from '../../models/product.model';
import { CommissionType } from '../../../unique-products/models/unique-product.model';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoryStore } from '../../../categories/service/category-store.service';
import { BrandStore } from '../../../brands/service/brand-store.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-product-dialog',
    imports: [Dialog, ButtonModule, DropdownModule, SkeletonModule, DragDropModule, TextareaModule, SelectModule, NgFor, FormsModule, ReactiveFormsModule, InputTextModule],

    templateUrl: './product-dialog.component.html'
})
export class ProductDialogComponent {
    private readonly store = inject(ProductStore);
    private readonly uploadService = inject(UploadService);
    private readonly categoryStore = inject(CategoryStore);
    private readonly brandStore = inject(BrandStore);
    fb = inject(NonNullableFormBuilder);

    // Imágenes
    mainImageFile: File | null = null;
    mainImagePreview: string | null = null;
    mainIsPrimary = true;
    submitted = signal(false);

    categories = this.categoryStore.list;
    loadingCategories = this.categoryStore.loading;
    brands = this.brandStore.list;
    loadingBrands = this.brandStore.loading;

    productId = this.store.selectedProductId;

    extraImageFiles: File[] = [];
    extraImagePreviews: { id?: number; imageUrl: string; isPrimary: boolean }[] = [];

    list = this.store.list;

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedProduct = this.store.selectedProduct;

    form: FormGroup<{
        [key in keyof ProductRequest]: FormControl<ProductRequest[key]>;
    }> = this.fb.group({
        title: this.fb.control<string>('', [Validators.required]),
        description: this.fb.control<string | null>(null),
        status: this.fb.control<STATUS>('ACTIVE', [Validators.required]),
        categoryId: this.fb.control<number>(0, [Validators.required]),
        brandId: this.fb.control<number>(0, [Validators.required]),
        commissionType: this.fb.control<CommissionType>('PERCENT', [Validators.required]),
        commissionValue: this.fb.control<number>(0, [Validators.required, Validators.min(0)]),
        gainType: this.fb.control<CommissionType>('PERCENT'),
        gainValue: this.fb.control<number>(0),
        images: this.fb.control<{ imageUrl: string; isPrimary?: boolean }[]>([])
    });

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);

            const product = this.selectedProduct();
            if (product) {
                this.form.patchValue(product);

                // Cargar imágenes existentes (en caso de edición)
                this.extraImagePreviews = (product.images ?? []).map((img) => ({
                    id: img.id,
                    imageUrl: img.imageUrl,
                    isPrimary: img.isPrimary ?? false
                }));

                this.extraImageFiles = []; // imágenes nuevas se agregan después
            } else {
                this.form.reset();
                this.extraImagePreviews = [];
                this.extraImageFiles = [];
            }
        }
    });

    commissionTypes: { label: string; value: CommissionType }[] = [
        { label: 'Porcentaje', value: 'PERCENT' },
        { label: 'Fijo', value: 'FIXED' }
    ];

    status: { label: string; value: STATUS }[] = [
        { label: 'ACTIVO', value: 'ACTIVE' },
        { label: 'PAUSADO', value: 'PAUSED' },
        { label: 'DESHABILITADO', value: 'DISABLED' }
    ];

    submit() {
        this.submitted.set(false);
        if (this.form.invalid) return;

        const dto = this.form.getRawValue();
        const uploadTasks = [];
        const images: { imageUrl: string; isPrimary?: boolean }[] = [];

        if (this.mainImageFile) {
            uploadTasks.push(
                this.uploadService.uploadAndGetFinalUrl$(this.mainImageFile).pipe(
                    switchMap((url) => {
                        images.push({ imageUrl: url, isPrimary: this.mainIsPrimary });
                        return of(true);
                    })
                )
            );
        }

        for (const file of this.extraImageFiles) {
            uploadTasks.push(
                this.uploadService.uploadAndGetFinalUrl$(file).pipe(
                    switchMap((url) => {
                        images.push({ imageUrl: url, isPrimary: false });
                        return of(true);
                    })
                )
            );
        }
        const runUpload$ = uploadTasks.length > 0 ? forkJoin(uploadTasks) : of([] as boolean[]);

        runUpload$.subscribe({
            next: () => {
                const fullDto = {
                    ...dto,
                    images: [
                        ...this.extraImagePreviews.filter((img) => img.id), // antiguas no eliminadas
                        ...images // nuevas subidas
                    ]
                };
                this.store.saveProduct(fullDto);
            },
            error: () => {}
        });
    }

    close() {
        this.store.closeDialog();
    }

    //manejo de las imagenes

    onExtraImagesSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = Array.from(input.files ?? []);

        for (const file of files) {
            const reader = new FileReader();
            reader.onload = () => {
                const isFirstImage = this.extraImagePreviews.length === 0;
                this.extraImagePreviews.push({
                    imageUrl: reader.result as string,
                    isPrimary: isFirstImage
                });
                this.extraImageFiles.push(file);
            };
            reader.readAsDataURL(file);
        }
    }

    setPrimary(index: number) {
        this.extraImagePreviews.forEach((img, i) => (img.isPrimary = i === index));
    }

    removeImage(index: number) {
        const removed = this.extraImagePreviews[index];

        if (removed?.id && removed.imageUrl) {
            this.store.markImageForDeletion({
                id: removed.id,
                imageUrl: removed.imageUrl
            });
        }

        this.extraImagePreviews.splice(index, 1);
        this.extraImageFiles.splice(index, 1);
    }

    onReorderImages(event: CdkDragDrop<any[]>) {
        moveItemInArray(this.extraImagePreviews, event.previousIndex, event.currentIndex);
        moveItemInArray(this.extraImageFiles, event.previousIndex, event.currentIndex);
    }

    onDropdownCategory() {
        this.categoryStore.loadList();
    }

    onFilterCategories(event: { filter: string }) {
        const query = event.filter?.trim() ?? '';

        this.categoryStore.onSearchChange(query);
    }
    onDropdownBrand() {
        this.brandStore.loadList();
    }

    onFilterBrands(event: { filter: string }) {
        const query = event.filter?.trim() ?? '';

        this.brandStore.onSearchChange(query);
    }
}
