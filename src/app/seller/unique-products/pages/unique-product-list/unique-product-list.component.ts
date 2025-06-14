import { Component, inject, OnInit, signal } from '@angular/core';
import { UniqueProductResponse } from '../../models/unique-product.model';
import { UniqueProductService } from '../../service/unique-product.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';

interface UniqueProductState {
    loading: boolean;
    data: UniqueProductResponse | null;
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    order: 'asc' | 'desc';
    condition?: string;
    functionality?: string;
}
@Component({
    selector: 'app-unique-product-list',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule, ToolbarModule, TagModule, IconFieldModule, InputIconModule, ButtonModule, TableModule],
    templateUrl: './unique-product-list.component.html'
})
export class UniqueProductListComponent implements OnInit {
    state = signal<UniqueProductState>({
        loading: true,
        data: null,
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'createdAt',
        order: 'desc'
    });

    private readonly uniqueProductService = inject(UniqueProductService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        const { page, limit, search, sortBy, order, functionality, condition } = this.state();

        this.uniqueProductService
            .getUniqueProducts({
                page,
                limit,
                search,
                sortBy,
                order,
                condition,
                functionality
            })
            .subscribe({
                next: (res) => {
                    this.state.set({
                        ...this.state(),
                        data: res.data,
                        loading: false
                    });
                    if (this.state().data && this.state().data?.data.length === 0) {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Sin productos',
                            detail: 'No tienes productos en este momento.'
                        });
                    }
                },

                error: (err) => {
                    this.state.set({
                        ...this.state(),
                        loading: false
                    });
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error al cargar productos',
                        detail: err?.error?.message ?? 'Error inesperado del servidor'
                    });
                }
            });
    }

    get first(): number {
        const s = this.state();
        return ((s?.page ?? 1) - 1) * (s?.limit ?? 10);
    }

    onPageChange(event: any) {
        this.state.update((s) => ({
            ...s,
            page: (event.page ?? 0) + 1,
            limit: event.rows ?? s.limit
        }));

        this.loadProducts();
    }

    onSearchChange(event: any) {
        const search = event.target.value;
        this.state.update((s) => ({
            ...s,
            search,
            page: 1
        }));
        this.loadProducts();
    }

    onProductDetail(productId: string) {
        this.router.navigate(['/seller/unique-product', productId]);
    }
}
