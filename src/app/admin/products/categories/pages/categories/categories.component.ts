import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { CategoryStore } from '../../service/category-store.service';
import { CategoryDialogComponent } from '../../components/category-dialog/category-dialog.component';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-categories',
    imports: [CommonModule, ProgressSpinnerModule, TooltipModule, ToolbarModule, TagModule, BadgeModule, IconFieldModule, InputIconModule, ButtonModule, TableModule, CategoryDialogComponent],
    templateUrl: './categories.component.html'
})
export class CategoriesComponent {
    private readonly store = inject(CategoryStore);
    private readonly confirmationService = inject(ConfirmationService);
    list = this.store.list;
    loading = this.store.loading;
    page = this.store.page;
    limit = this.store.limit;
    total = this.store.total;
    dialogOpen = this.store.dialogOpen;
    search = this.store.search;

    ngOnInit() {
        this.store.loadList(true);
    }

    openNew() {
        this.store.openDialog();
    }

    onEdit(categoryId: number) {
        this.store.openDialog(categoryId);
    }

    onPageChange(event: any) {
        this.store.onPageChange(event);
    }

    onSearchChange(event: any) {
        this.store.onSearchChange(event.target.value);
    }

    get first(): number {
        return ((this.page() ?? 1) - 1) * (this.limit() ?? 10);
    }

    onDelete(categoryId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea eliminar esta categoría?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.deleteCategory(categoryId);
            }
        });
    }
}
