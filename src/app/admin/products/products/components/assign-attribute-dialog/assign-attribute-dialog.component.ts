import { Component, inject } from '@angular/core';
import { ProductAttributeStore } from '../../service/productAttribute-store.service';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { AttributeResponse } from '../../../attributes/models/attribute.model';
import { ProductValuesAttributeStore } from '../../service/productValuesAttribute-store.service';
import { ProductStore } from '../../service/product-store.service';
import { AssignValuesAttributeDialogComponent } from '../assign-values-attribute-dialog/assign-values-attribute-dialog.component';

@Component({
    selector: 'app-assign-attribute-dialog',
    imports: [Dialog, FormsModule, DropdownModule, SelectModule, TableModule, IconFieldModule, InputIconModule, ButtonModule, AssignValuesAttributeDialogComponent],

    templateUrl: './assign-attribute-dialog.component.html'
})
export class AssignAttributeDialogComponent {
    private readonly storeProductAttribute = inject(ProductAttributeStore);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly storeProductValueAttribute = inject(ProductValuesAttributeStore);
    dialogOpen = this.storeProductAttribute.dialogOpen;

    list = this.storeProductAttribute.list;

    seletedProductId = this.storeProductAttribute.selectedProductId;

    loading = this.storeProductAttribute.loading;
    page = this.storeProductAttribute.page;
    limit = this.storeProductAttribute.limit;
    total = this.storeProductAttribute.total;
    search = this.storeProductAttribute.search;

    selectedAttribute: AttributeResponse | null = null;
    listAttributes = this.storeProductAttribute.listUnassignProductAttribute;
    loadingAttributes = this.storeProductAttribute.loadingUnassignProductAttribute;
    searchAttributes = this.storeProductAttribute.searchUnassignProductAttribute;

    onSearchChange(event: any) {
        this.storeProductAttribute.onSearchChange(event.target.value);
    }

    onPageChange(event: any) {
        this.storeProductAttribute.onPageChange(event);
    }

    onFilterAttributes(event: { filter: string }) {
        const query = event.filter?.trim() ?? '';

        this.storeProductAttribute.onSearchChangeAttributes(query);
    }
    onDropdownOpen() {
        this.selectedAttribute = null;
        this.listAttributes.set([]);
        this.storeProductAttribute.onDropdownOpen();
    }

    onAssign(event: AttributeResponse) {
        this.selectedAttribute = event;
        this.confirmationService.confirm({
            message: '¿Está seguro que asignar?',
            header: 'Confirmar asignacion',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Si'
            },
            accept: () => {
                this.storeProductAttribute.assignProductAttribute(event.id);
                this.selectedAttribute = null;
            }
        });
    }

    onAssignValues(attributeId: number) {
        this.storeProductValueAttribute.openDialog(this.seletedProductId()!, attributeId);
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
                this.storeProductAttribute.unassignProductAttribute(id);
                this.selectedAttribute = null;
            }
        });
    }

    get first(): number {
        return ((this.page() ?? 1) - 1) * (this.limit() ?? 10);
    }
}
