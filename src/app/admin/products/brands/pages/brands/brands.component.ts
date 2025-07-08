import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { BrandDialogComponent } from '../../components/brand-dialog/brand-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { BrandStore } from '../../service/brand-store.service';

@Component({
    selector: 'app-brands',
    imports: [CommonModule, ProgressSpinnerModule, ToolbarModule, TagModule, BadgeModule, IconFieldModule, InputIconModule, ButtonModule, TableModule, BrandDialogComponent],

    templateUrl: './brands.component.html'
})
export class BrandsComponent {
    private readonly store = inject(BrandStore);

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

    onEdit(brandId: number) {
        this.store.openDialog(brandId);
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

    onDelete(brandId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea eliminar esta marca?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.deleteBrand(brandId);
            }
        });
    }
}
