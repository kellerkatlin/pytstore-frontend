import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { AttributeDialogComponent } from '../../components/attribute-dialog/attribute-dialog.component';
import { AttributeStore } from '../../service/attribute-store.service';
import { TooltipModule } from 'primeng/tooltip';
import { AttributeValueStore } from '../../service/attributeValue-store.service';
import { AttributeValuesDialogComponent } from '../../components/attribute-values-dialog/attribute-values-dialog.component';
@Component({
    selector: 'app-attributes',
    imports: [CommonModule, ProgressSpinnerModule, TooltipModule, ToolbarModule, TagModule, BadgeModule, IconFieldModule, InputIconModule, ButtonModule, TableModule, AttributeDialogComponent, AttributeValuesDialogComponent],
    templateUrl: './attributes.component.html'
})
export class AttributesComponent {
    private readonly store = inject(AttributeStore);
    private readonly storeAttributeValue = inject(AttributeValueStore);
    private readonly router = inject(Router);
    private readonly confirmationService = inject(ConfirmationService);
    list = this.store.list;
    loading = this.store.loading;
    page = this.store.page;
    limit = this.store.limit;
    total = this.store.total;
    search = this.store.search;

    ngOnInit() {
        this.store.loadList(true);
    }

    openNew() {
        this.store.openDialog();
    }

    onEdit(attributeId: number) {
        this.store.openDialog(attributeId);
    }

    onAddValue(attributeId: number) {
        this.storeAttributeValue.loadList(attributeId, true);
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
            message: '¿Está seguro que desea eliminar esta marca?',
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
