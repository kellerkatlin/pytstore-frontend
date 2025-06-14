import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UniqueProductService } from '../../service/unique-product.service';
import { CardModule } from 'primeng/card';
import { UniqueProductDetailResponse } from '../../models/unique-product-detail';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-unique-product-detail',
    imports: [CardModule, CarouselModule, ButtonModule, TagModule, DividerModule, ChipModule, CurrencyPipe, TableModule],
    templateUrl: './unique-product-detail.component.html'
})
export class UniqueProductDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly uniqueProductService = inject(UniqueProductService);
    private readonly router = inject(Router);
    productDetail = signal<UniqueProductDetailResponse | null>(null);
    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');
            if (id) {
                this.uniqueProductService.getUniqueProductDetail(id).subscribe({
                    next: (res) => {
                        this.productDetail.set(res.data);
                    },
                    error: (err) => {
                        console.error('Error loading product details:', err);
                    }
                });
            }
        });
    }
    addToCart(product: any): void {
        console.log('Add to cart functionality not implemented yet.');
    }

    sellProduct(product: UniqueProductDetailResponse | null): void {
        if (product) {
            this.router.navigate(['/seller/sales', product.id]);
        }
    }
}
