import { Component, inject } from '@angular/core';
import { AttributeValueStore } from '../../service/attributeValue-store.service';
import { Dialog } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AttributeValueDialogComponent } from '../attribute-value-dialog/attribute-value-dialog.component';

@Component({
    selector: 'app-attribute-values-dialog',
    imports: [Dialog, ProgressSpinnerModule, ToolbarModule, ButtonModule, TableModule, IconFieldModule, InputIconModule, AttributeValueDialogComponent],
    templateUrl: './attribute-values-dialog.component.html'
})
export class AttributeValuesDialogComponent {
    private readonly store = inject(AttributeValueStore);
    private readonly confirmationService = inject(ConfirmationService);
    dialogOpen = this.store.dialogOpenAddAttribute;
    loadingDialog = this.store.loadingDialog;
    list = this.store.list;
    loading = this.store.loading;
    page = this.store.page;
    limit = this.store.limit;
    total = this.store.total;
    search = this.store.search;

    openNew() {
        this.store.openDialog();
    }

    onEdit(attributeId: number) {
        this.store.openDialog(attributeId);
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

    onDelete(attributeId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea eliminar este valor?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.store.deleteAttribute(attributeId);
            }
        });
    }
}
