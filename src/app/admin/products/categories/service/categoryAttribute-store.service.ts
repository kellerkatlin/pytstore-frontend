import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CategoryService } from './category.service';
import { CategoryRequest, CategoryResponse } from '../models/category.model';
import { AttributeStore } from '../../attributes/service/attribute-store.service';

@Injectable({ providedIn: 'root' })
export class CategoryAtributeStore {
    private readonly service = inject(CategoryService);
    private readonly storeAttribute = inject(AttributeStore);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<CategoryResponse[]>([]);
    listUnassignCategoryAttribute = signal<CategoryResponse[]>([]);

    loading = signal(false);
    loadingUnassignCategoryAttribute = signal(false);

    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedCategoryId = signal<number | null>(null);
    selectedCategory = signal<CategoryResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    pageUnassignCategoryAttribute = signal(1);
    limitUnassignCategoryAttribute = signal(10);
    searchUnassignCategoryAttribute = signal('');
    totalUnassignCategoryAttribute = signal(0);

    // Cargar la lista inicial

    loadList(categoryId: number, showToast = false) {
        this.selectedCategoryId.set(categoryId);

        this.loading.set(true);
        this.service.getAttributesByCategory(categoryId, { page: this.page(), limit: this.limit(), search: this.search() }).subscribe({
            next: (res) => {
                this.list.set(res.data.data);
                this.total.set(res.data.meta.total);
                this.loading.set(false);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Atributos cargados correctamente'
                    });
                }
            },
            error: () => {
                this.loading.set(false);
            }
        });
        console.log(this.listUnassignCategoryAttribute());
    }

    loadListUnassignCategoryAttribute(categoryId: number, showToast = false) {
        this.loadingUnassignCategoryAttribute.set(true);
        this.service.getUnassignAttributes(categoryId, { page: this.pageUnassignCategoryAttribute(), limit: this.limitUnassignCategoryAttribute(), search: this.searchUnassignCategoryAttribute() }).subscribe({
            next: (res) => {
                this.listUnassignCategoryAttribute.set(res.data.data);
                this.totalUnassignCategoryAttribute.set(res.data.meta.total);
                this.loadingUnassignCategoryAttribute.set(false);
                if (showToast) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Atributos cargados correctamente'
                    });
                }
            },
            error: () => {
                this.loadingUnassignCategoryAttribute.set(false);
            }
        });
    }
    onPageChange(event: { first: number; rows: number }) {
        this.page.set(event.first + 1);
        this.limit.set(event.rows);
        this.loadList(this.selectedCategoryId()!);
    }

    onDropdownOpen() {
        this.loadListUnassignCategoryAttribute(this.selectedCategoryId()!);
    }

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList(this.selectedCategoryId()!);
    }

    onSearchChangeAttributes(search: string) {
        this.searchUnassignCategoryAttribute.set(search);
        this.page.set(1);
        this.loadListUnassignCategoryAttribute(this.selectedCategoryId()!);
    }

    // Abrir el dialog
    openDialog(categoryId: number) {
        this.dialogOpen.set(true);
        this.loadList(categoryId, true);
        this.storeAttribute.loadList();
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedCategoryId.set(null);
    }

    saveCategory(dto: CategoryRequest) {
        this.saving.set(true);
        const id = this.selectedCategoryId();

        const op$ = id ? this.service.updateCategory(id, dto) : this.service.createCategory(dto);

        op$.subscribe({
            next: ({ data }) => {
                if (id) {
                    this.list.update((current) => current.map((p) => (p.id === data.id ? data : p)));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Actualizado correctamente'
                    });
                } else {
                    this.list.update((current) => [...current, data]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado correctamente'
                    });
                }
                this.closeDialog();
                this.saving.set(false);
            },
            error: () => {
                this.saving.set(false);
            }
        });
    }

    assignCategoryAttribute(id: number) {
        this.service.assignAttribute(this.selectedCategoryId()!, id).subscribe({
            next: () => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.loadList(this.selectedCategoryId()!);
                this.messageService.add({ severity: 'success', summary: 'Asignacion correctamente' });
            },
            error: () => {}
        });
    }

    unassignCategoryAttribute(id: number) {
        this.service.unassignAttribute(this.selectedCategoryId()!, id).subscribe({
            next: () => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.loadList(this.selectedCategoryId()!);
                this.messageService.add({ severity: 'success', summary: 'Des asignado correctamente' });
            },
            error: () => {}
        });
    }
}
