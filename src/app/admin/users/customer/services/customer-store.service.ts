import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerService } from './customer.service';
import { CustomerRequest, CustomerResponse } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerStore {
    private readonly service = inject(CustomerService);
    private readonly messageService = inject(MessageService);

    // Signals globales del módulo
    list = signal<CustomerResponse[]>([]);

    loading = signal(false);
    loadingDialog = signal(false);
    saving = signal(false);
    dialogOpen = signal(false);
    selectedCustomerId = signal<number | null>(null);
    selectedCustomer = signal<CustomerResponse | null>(null);

    page = signal(1);
    limit = signal(10);
    search = signal('');
    total = signal(0);

    // Cargar la lista inicial
    loadList(showToast = false) {
        this.loading.set(true);

        this.service
            .getCustomers({
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
                            detail: res.message ?? 'Clientes cargados correctamente'
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
    openDialog(CustomerId?: number) {
        this.selectedCustomerId.set(CustomerId ?? null);
        this.dialogOpen.set(true);

        if (CustomerId) {
            this.loadingDialog.set(true);
            this.service.getCustomerById(CustomerId).subscribe({
                next: (res) => {
                    this.selectedCustomer.set(res.data);
                    this.loadingDialog.set(false);
                },
                error: () => {
                    this.loadingDialog.set(false);
                    this.dialogOpen.set(false);
                }
            });
        } else {
            this.selectedCustomer.set(null);
        }
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.selectedCustomerId.set(null);
    }

    saveCustomer(dto: CustomerRequest) {
        this.saving.set(true);
        const id = this.selectedCustomerId();

        const op$ = id ? this.service.updateCustomer(id, dto) : this.service.createCustomer(dto);

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

    deleteCustomer(id: number) {
        this.service.deleteCustomer(id).subscribe({
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
