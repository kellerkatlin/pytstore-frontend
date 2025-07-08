import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomerStore } from '../services/customer-store.service';
import { CustomerDialogComponent } from '../components/customer-dialog/customer-dialog.component';

@Component({
    selector: 'app-customers',
    imports: [CommonModule, ProgressSpinnerModule, ToolbarModule, TagModule, BadgeModule, IconFieldModule, InputIconModule, ButtonModule, TableModule, CustomerDialogComponent],
    templateUrl: './customers.html'
})
export class Customers {
    private readonly store = inject(CustomerStore);

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
            message: '¿Está seguro que desea eliminar este cliente?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.deleteCustomer(brandId);
            }
        });
    }
}
