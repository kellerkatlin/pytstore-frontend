import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AttributeRequest, AttributeResponse } from '../models/attribute.model';
import { AttributeService } from './attribute.service';
import { AttributeValueStore } from './attributeValue-store.service';

@Injectable({ providedIn: 'root' })
export class AttributeStore {
    private readonly service = inject(AttributeService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<AttributeResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    loadingDialogAddValue = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedAttributeId = signal<number | null>(null);
    selectedAttribute = signal<AttributeResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getAttributes({
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
                            detail: res.message ?? 'Attributos cargados correctamente'
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
        const currentPage = event.first / event.rows + 1;
        this.page.set(currentPage);
        this.limit.set(event.rows);
        this.loadList();
    }

    onSearchChange(search: string) {
        this.search.set(search);
        this.page.set(1);
        this.loadList();
    }

    // Abrir el dialog
    openDialog(attributeId?: number) {
        this.selectedAttributeId.set(attributeId ?? null);
        this.dialogOpen.set(true);

        if (attributeId) {
            this.loadingDialog.set(true);
            this.service.getAttributeById(attributeId).subscribe({
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

    saveAttribute(dto: AttributeRequest) {
        this.saving.set(true);
        const id = this.selectedAttributeId();

        const op$ = id ? this.service.updateAttribute(id, dto) : this.service.createAttribute(dto);

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
        this.service.deleteAttribute(id).subscribe({
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
