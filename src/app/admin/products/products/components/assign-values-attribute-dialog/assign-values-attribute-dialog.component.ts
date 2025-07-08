import { Component, inject } from '@angular/core';
import { ProductValuesAttributeStore } from '../../service/productValuesAttribute-store.service';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AttributeValueResponse } from '../../../attributes/models/attributeValue.model';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-assign-values-attribute-dialog',
    imports: [Dialog, FormsModule, DropdownModule, SelectModule, TableModule, IconFieldModule, InputIconModule, ButtonModule],

    templateUrl: './assign-values-attribute-dialog.component.html'
})
export class AssignValuesAttributeDialogComponent {
    private readonly storeProductValuesAttribute = inject(ProductValuesAttributeStore);
    private readonly confirmationService = inject(ConfirmationService);
    dialogOpen = this.storeProductValuesAttribute.dialogOpen;

    list = this.storeProductValuesAttribute.list;

    loading = this.storeProductValuesAttribute.loading;
    page = this.storeProductValuesAttribute.page;
    limit = this.storeProductValuesAttribute.limit;
    total = this.storeProductValuesAttribute.total;
    search = this.storeProductValuesAttribute.search;
    selectedValuesAttribute: AttributeValueResponse | null = null;
    listAttributes = this.storeProductValuesAttribute.listUnassignProductValuesAttribute;
    loadingAttributes = this.storeProductValuesAttribute.loadingUnassignProductValuesAttribute;
    searchAttributes = this.storeProductValuesAttribute.searchUnassignProductValuesAttribute;

    onSearchChange(event: any) {
        this.storeProductValuesAttribute.onSearchChange(event.target.value);
    }

    onPageChange(event: any) {
        this.storeProductValuesAttribute.onPageChange(event);
    }

    onFilterAttributes(event: { filter: string }) {
        const query = event.filter?.trim() ?? '';

        this.storeProductValuesAttribute.onSearchChangeAttributes(query);
    }
    onDropdownOpen() {
        this.selectedValuesAttribute = null;
        this.listAttributes.set([]);
        this.storeProductValuesAttribute.onDropdownOpen();
    }

    onAssign(event: AttributeValueResponse) {
        this.selectedValuesAttribute = event;
        this.confirmationService.confirm({
            message: '¿Está seguro que asignar?',
            header: 'Confirmar asignacion',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.storeProductValuesAttribute.assignProductValueAttribute(event.id);
                this.selectedValuesAttribute = null;
            }
        });
    }

    unassignProductAttribute(id: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea des asignar?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.storeProductValuesAttribute.unassignProductAttribute(id);
                this.selectedValuesAttribute = null;
            }
        });
    }

    get first(): number {
        return ((this.page() ?? 1) - 1) * (this.limit() ?? 10);
    }
}
