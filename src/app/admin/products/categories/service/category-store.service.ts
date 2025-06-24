import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CategoryService } from './category.service';
import { CategoryRequest, CategoryResponse } from '../models/category.model';
import { AttributeStore } from '../../attributes/service/attribute-store.service';
import { AttributeResponse } from '../../attributes/models/attribute.model';

@Injectable({ providedIn: 'root' })
export class CategoryStore {
    private readonly service = inject(CategoryService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<CategoryResponse[]>([]);
    listAttributeByCategory = signal<AttributeResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedCategoryId = signal<number | null>(null);
    selectedCategory = signal<CategoryResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getCategories({
                page: this.page(),
                limit: this.limit(),
                search: this.search()
            })
            .subscribe({
                next: (res) => {
                    this.list.set(res.data.data);
                    this.total.set(res.data.meta.total);
                    if (showToast) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Categorias cargados correctamente'
                        });
                    }

                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                }
            });
    }

    onPageChange(event: { first: number; rows: number }) {
        this.page.set(event.first + 1);
        this.limit.set(event.rows);
        this.loadList();
    }

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList();
    }

    // Abrir el dialog
    openDialog(categoryId?: number) {
        this.selectedCategoryId.set(categoryId ?? null);
        this.dialogOpen.set(true);

        if (categoryId) {
            this.loadingDialog.set(true);
            this.service.getCategoryById(categoryId).subscribe({
                next: (res) => {
                    this.selectedCategory.set(res.data);
                    this.loadingDialog.set(false);

                    console.log('Categoria cargado:', this.selectedCategory());
                },
                error: () => {
                    this.loadingDialog.set(false);
                    this.dialogOpen.set(false);
                }
            });
        } else {
            this.selectedCategory.set(null);
        }
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

    deleteCategory(id: number) {
        this.service.deleteCategory(id).subscribe({
            next: () => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.messageService.add({ severity: 'success', summary: 'Eliminada correctamente' });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error al eliminar' });
            }
        });
    }
}
