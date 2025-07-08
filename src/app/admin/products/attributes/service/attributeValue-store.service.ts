import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AttributeValueService } from './attributeValue.service';
import { AttributeValueRequest, AttributeValueResponse } from '../models/attributeValue.model';

@Injectable({ providedIn: 'root' })
export class AttributeValueStore {
    private readonly service = inject(AttributeValueService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<AttributeValueResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    loadingDialogAddValue = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    dialogOpenAddAttribute = signal(false);
    selectedAttributeId = signal<number | null>(null);
    selectedAttribute = signal<AttributeValueResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);
    attributeId = signal<number>(0);

    // Cargar la lista inicial
    loadList(attributeId: number, showToast = false) {
        this.loading.set(true);
        this.attributeId.set(attributeId);
        this.dialogOpenAddAttribute.set(true);
        this.service
            .getAttributeValuesByAttribute(attributeId, {
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
                            detail: res.message ?? 'Valores de cargados correctamente'
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
        this.loadList(this.attributeId());
    }

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList(this.attributeId());
    }

    // Abrir el dialog
    openDialog(attributeValueId?: number) {
        this.selectedAttributeId.set(attributeValueId ?? null);
        this.dialogOpen.set(true);

        if (attributeValueId) {
            this.loadingDialog.set(true);

            this.service.getAttributeValueById(attributeValueId).subscribe({
                next: (res) => {
                    this.selectedAttribute.set(res.data);
                    this.loadingDialog.set(false);
                },
                error: () => {
                    this.loadingDialog.set(false);
                    this.dialogOpen.set(false);
                }
            });
        } else {
            this.selectedAttribute.set(null);
        }
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedAttributeId.set(null);
    }

    saveAttribute(dto: AttributeValueRequest) {
        this.saving.set(true);
        const id = this.selectedAttributeId();

        const op$ = id ? this.service.updateAttributeValue(id, dto) : this.service.createAttributeValue(this.attributeId(), dto);

        op$.subscribe({
            next: (res) => {
                const { data } = res;
                if (id) {
                    this.list.update((current) => current.map((p) => (p.id === data.id ? data : p)));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Actualizado correctamente',
                        detail: res.message ?? ''
                    });
                } else {
                    this.list.update((current) => [...current, data]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado correctamente',
                        detail: res.message ?? ''
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

    deleteAttribute(id: number) {
        this.service.deleteAttributeValue(id).subscribe({
            next: (res) => {
                this.list.update((list) => list.filter((c) => c.id !== id));
                this.messageService.add({ severity: 'success', summary: 'Eliminada correctamente', detail: 'Valor eliminado correctamente' });
            },
            error: () => {}
        });
    }
}
