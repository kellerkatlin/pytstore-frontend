import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { AttributesProduct, ProductQuery, ProductRequest, ProductResponse } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly baseUrl = `${environment.api}/product`;
    private readonly http = inject(HttpClient);

    getProducts(query: ProductQuery): Observable<ApiResponsePaginated<ProductResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof ProductQuery] !== undefined) {
                params = params.set(key, query[key as keyof ProductQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<ProductResponse>>(`${this.baseUrl}`, { params });
    }

    getAttributeToValueProducts(productId: number): Observable<ApiResponse<AttributesProduct>> {
        return this.http.get<ApiResponse<AttributesProduct>>(`${this.baseUrl}/${productId}/attribute-value-tree`);
    }

    getProductById(id: number): Observable<ApiResponse<ProductResponse>> {
        return this.http.get<ApiResponse<ProductResponse>>(`${this.baseUrl}/${id}`);
    }

    updateProduct(id: number, product: ProductRequest): Observable<ApiResponse<ProductResponse>> {
        return this.http.put<ApiResponse<ProductResponse>>(`${this.baseUrl}/${id}`, product);
    }

    createProduct(product: ProductRequest): Observable<ApiResponse<ProductResponse>> {
        return this.http.post<ApiResponse<ProductResponse>>(`${this.baseUrl}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
