import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { UninqueProductQuery, UniqueProductRequest, UniqueProductResponse } from '../models/unique-product.model';

@Injectable({
    providedIn: 'root'
})
export class UniqueProductService {
    private readonly baseUrl = `${environment.api}/product-item`;
    private readonly http = inject(HttpClient);

    getUniqueProducts(query: UninqueProductQuery): Observable<ApiResponsePaginated<UniqueProductResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof UninqueProductQuery] !== undefined) {
                params = params.set(key, query[key as keyof UninqueProductQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<UniqueProductResponse>>(`${this.baseUrl}`, { params });
    }

    getUniqueProductById(id: number): Observable<ApiResponse<UniqueProductResponse>> {
        return this.http.get<ApiResponse<UniqueProductResponse>>(`${this.baseUrl}/${id}`);
    }

    updateUniqueProduct(id: number, product: UniqueProductRequest): Observable<ApiResponse<UniqueProductResponse>> {
        return this.http.put<ApiResponse<UniqueProductResponse>>(`${this.baseUrl}/${id}`, product);
    }

    createUniqueProduct(product: UniqueProductRequest): Observable<ApiResponse<UniqueProductResponse>> {
        return this.http.post<ApiResponse<UniqueProductResponse>>(`${this.baseUrl}`, product);
    }

    deleteUniqueProduct(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    }
}
