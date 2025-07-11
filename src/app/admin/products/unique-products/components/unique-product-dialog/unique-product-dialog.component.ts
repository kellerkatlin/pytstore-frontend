import { Component, effect, inject, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommissionType, ProductCondition, TaxAffectationType, UniqueProductRequest } from '../../models/unique-product.model';
import { UniqueProductStore } from '../../services/unique-product-store.service';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NgFor } from '@angular/common';
import { UploadService } from '../../../../../shared/services/upload.service';
import { combineLatest, forkJoin, of, skip, switchMap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProductStore } from '../../../products/service/product-store.service';
import { DropdownModule } from 'primeng/dropdown';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { ProductService } from '../../../products/service/product.service';

@Component({
    selector: 'app-unique-product-dialog',
    imports: [Dialog, ButtonModule, DropdownModule, DragDropModule, SkeletonModule, TextareaModule, SelectModule, NgFor, FormsModule, ReactiveFormsModule, InputTextModule],
    templateUrl: './unique-product-dialog.component.html'
})
export class UniqueProductDialogComponent {
    private readonly store = inject(UniqueProductStore);
    private readonly uploadService = inject(UploadService);
    private readonly productStore = inject(ProductStore);
    private readonly productService = inject(ProductService);

    products = this.productStore.list;
    productId = this.store.selectedProductId;
    loadingProducts = this.productStore.loading;
    list = this.store.list;
    fb = inject(NonNullableFormBuilder);
    // Imágenes
    mainImageFile: File | null = null;
    mainImagePreview: string | null = null;
    mainIsPrimary = true;
    submitted = signal(false);
    loadingAttributes = signal(false);
    extraImageFiles: File[] = [];
    extraImagePreviews: { id?: number; imageUrl: string; isPrimary: boolean }[] = [];

    attributeGroups: {
        attributeId: number;
        name: string;
        values: { valueId: number; value: string }[];
        selectedValueId?: number;
    }[] = [];

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedProduct = this.store.selectedProduct;

    unitCost: number | null = null;
    gainValueFocused = false;
    salePriceFocused = false;

    private userIsTyping: 'gainValue' | 'salePrice' | null = null;
    private isUpdatingInternally = false;

    form: FormGroup<{
        [key in keyof UniqueProductRequest]: FormControl<UniqueProductRequest[key]>;
    }> = this.fb.group({
        productId: this.fb.control<number>(0, [Validators.required]),
        serialCode: this.fb.control<string>('', [Validators.required]),
        images: this.fb.control<{ imageUrl: string; isPrimary?: boolean }[]>([]),
        salePrice: this.fb.control<number>(0, [Validators.required]),
        commissionValue: this.fb.control<number>(0),
        commissionType: this.fb.control<CommissionType>('PERCENT'),
        gainType: this.fb.control<CommissionType>('PERCENT'),
        gainValue: this.fb.control<number>(0),
        taxType: this.fb.control<TaxAffectationType>('GRAVADO'),
        attributes: this.fb.control<
            {
                attributeId: number;
                valueId: number;
            }[]
        >([]),
        description: this.fb.control<string>('', [Validators.required])
    });

    // ngOnInit() {
    //     this.unitCost = null;
    //     this.form.reset();
    //     this.unitCost = this.selectedProduct()!?.unitCost;
    //     console.log('hola');
    //     const gainValueCtrl = this.form.get('gainValue')!;
    //     const gainTypeCtrl = this.form.get('gainType')!;
    //     const salePriceCtrl = this.form.get('salePrice')!;

    //     console.log('unitCost actual:', this.selectedProduct());
    //     // Recalcular salePrice cuando se escribe en gainValue o cambia gainType
    //     gainValueCtrl.valueChanges.subscribe((gainValue) => {
    //         if (this.unitCost == null || this.userIsTyping !== 'gainValue' || this.isUpdatingInternally) return;

    //         const gainType = gainTypeCtrl.value;
    //         const utilidad = gainType === 'PERCENT' ? (this.unitCost * gainValue) / 100 : gainValue;
    //         const nuevoPrecio = this.unitCost + utilidad;

    //         this.isUpdatingInternally = true;
    //         salePriceCtrl.setValue(+nuevoPrecio.toFixed(2), { emitEvent: false });
    //         this.isUpdatingInternally = false;
    //     });

    //     // Recalcular gainValue cuando se escribe en salePrice
    //     salePriceCtrl.valueChanges.subscribe((nuevoPrecio) => {
    //         if (this.unitCost == null || this.userIsTyping !== 'salePrice' || this.isUpdatingInternally) return;

    //         const gainType = gainTypeCtrl.value;
    //         const utilidad = nuevoPrecio - this.unitCost;
    //         const nuevoGain = gainType === 'PERCENT' ? (utilidad / this.unitCost) * 100 : utilidad;

    //         this.isUpdatingInternally = true;
    //         gainValueCtrl.setValue(+nuevoGain.toFixed(2), { emitEvent: false });
    //         this.isUpdatingInternally = false;
    //     });

    //     gainTypeCtrl.valueChanges.subscribe((gainType) => {
    //         if (this.unitCost == null || this.isUpdatingInternally) return;

    //         const gainValue = gainValueCtrl.value;
    //         const utilidad = gainType === 'PERCENT' ? (this.unitCost * gainValue) / 100 : gainValue;
    //         const nuevoPrecio = this.unitCost + utilidad;

    //         this.isUpdatingInternally = true;
    //         salePriceCtrl.setValue(+nuevoPrecio.toFixed(2), { emitEvent: false });
    //         this.isUpdatingInternally = false;
    //     });
    // }

    onUserTyping(c: 'gainValue' | 'salePrice' | null) {
        this.userIsTyping = c;
    }

    private readonly syncFormEffect = effect(() => {
        if (!this.dialogOpen()) return;

        this.submitted.set(false);
        this.unitCost = null;
        this.form.get('salePrice')?.disable();

        const product = this.selectedProduct();
        if (!product) {
            this.form.reset();
            this.attributeGroups = [];
            this.extraImagePreviews = [];
            this.extraImageFiles = [];
            return;
        }

        this.form.patchValue(product);
        this.onProductSelected(+product.productId);
        this.form.get('salePrice')?.enable();
        this.unitCost = product.unitCost ?? null;

        this.extraImagePreviews = (product.images ?? []).map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary ?? false
        }));
        this.extraImageFiles = [];

        const gainValueCtrl = this.form.get('gainValue')!;
        const gainTypeCtrl = this.form.get('gainType')!;
        const salePriceCtrl = this.form.get('salePrice')!;

        // ⚠️ Evita múltiples subscripciones al volver a abrir el diálogo
        gainValueCtrl.valueChanges.subscribe((gainValue) => {
            if (this.unitCost == null || this.userIsTyping !== 'gainValue' || this.isUpdatingInternally) return;

            const gainType = gainTypeCtrl.value;
            const utilidad = gainType === 'PERCENT' ? (this.unitCost * gainValue) / 100 : gainValue;
            const nuevoPrecio = this.unitCost + utilidad;

            this.isUpdatingInternally = true;
            salePriceCtrl.setValue(+nuevoPrecio, { emitEvent: false });
            this.isUpdatingInternally = false;
        });

        salePriceCtrl.valueChanges.subscribe((nuevoPrecio) => {
            if (this.unitCost == null || this.userIsTyping !== 'salePrice' || this.isUpdatingInternally) return;

            const gainType = gainTypeCtrl.value;
            const utilidad = nuevoPrecio - this.unitCost;
            const nuevoGain = gainType === 'PERCENT' ? (utilidad / this.unitCost) * 100 : utilidad;

            this.isUpdatingInternally = true;
            gainValueCtrl.setValue(+nuevoGain, { emitEvent: false });
            this.isUpdatingInternally = false;
        });

        gainTypeCtrl.valueChanges.subscribe((gainType) => {
            if (this.unitCost == null || this.isUpdatingInternally) return;

            const gainValue = gainValueCtrl.value;
            const utilidad = gainType === 'PERCENT' ? (this.unitCost * gainValue) / 100 : gainValue;
            const nuevoPrecio = this.unitCost + utilidad;

            this.isUpdatingInternally = true;
            salePriceCtrl.setValue(+nuevoPrecio, { emitEvent: false });
            this.isUpdatingInternally = false;
        });
    });

    onProductSelected(productId: number) {
        this.loadingAttributes.set(true);
        if (!productId) return;

        const selected = this.selectedProduct();
        const selectedAttributes = selected?.attributes ?? [];

        this.productService.getAttributeToValueProducts(productId).subscribe({
            next: (res) => {
                this.attributeGroups = res.data.attributes.map((attr) => {
                    const selectedAttr = selectedAttributes.find((a) => a.attributeId === attr.attributeId);
                    return {
                        ...attr,
                        selectedValueId: selectedAttr?.valueId
                    };
                });
                this.loadingAttributes.set(false);
            },
            error: () => {
                this.attributeGroups = [];
                this.loadingAttributes.set(false);
            }
        });
    }

    // private readonly syncGainAndSalePriceEffect = effect(() => {
    //     const gainType = this.form.get('gainType')?.value;
    //     const gainValue = this.form.get('gainValue')?.value ?? 0;
    //     const salePriceControl = this.form.get('salePrice');
    //     const salePrice = salePriceControl?.value ?? 0;

    //     if (this.unitCost == null) return;

    //     const utilidadEsperada = gainType === 'PERCENT' ? (this.unitCost * gainValue) / 100 : gainValue;

    //     const precioCalculado = this.unitCost + utilidadEsperada;

    //     if (this.gainValueFocused) {
    //         salePriceControl?.setValue(Number(precioCalculado.toFixed(2)), { emitEvent: false });
    //     } else if (this.salePriceFocused) {
    //         const nuevaUtilidad = salePrice - this.unitCost;
    //         const nuevoGain = gainType === 'PERCENT' ? (nuevaUtilidad / this.unitCost) * 100 : nuevaUtilidad;

    //         this.form.get('gainValue')?.setValue(Number(nuevoGain.toFixed(2)), { emitEvent: false });
    //     }
    // });

    onDropdownOpen() {
        this.products.set([]);
        this.productStore.loadList();
    }

    onFilterAttributes(event: { filter: string }) {
        const query = event.filter?.trim() ?? '';

        this.productStore.onSearchChange(query);
    }

    commissionTypes: { label: string; value: CommissionType }[] = [
        { label: 'Porcentaje', value: 'PERCENT' },
        { label: 'Fijo', value: 'FIXED' }
    ];

    taxTypes: { label: TaxAffectationType; value: TaxAffectationType }[] = [
        { label: 'GRAVADO', value: 'GRAVADO' },
        { label: 'INAFECTO', value: 'INAFECTO' }
    ];

    submit() {
        this.submitted.set(false);
        if (this.form.invalid) return;

        const dto = this.form.getRawValue();

        const attributes = this.attributeGroups
            .filter((attr) => attr.selectedValueId)
            .map((attr) => ({
                attributeId: attr.attributeId,
                valueId: attr.selectedValueId!
            }));

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
                    attributes,
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

    // manejo de imagenes

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
    setPrimary(index: number) {
        this.extraImagePreviews.forEach((img, i) => (img.isPrimary = i === index));
    }

    onReorderImages(event: CdkDragDrop<any[]>) {
        moveItemInArray(this.extraImagePreviews, event.previousIndex, event.currentIndex);
        moveItemInArray(this.extraImageFiles, event.previousIndex, event.currentIndex);
    }

    close() {
        this.store.closeDialog();
        this.form.reset();
        this.unitCost = null;
    }
}
