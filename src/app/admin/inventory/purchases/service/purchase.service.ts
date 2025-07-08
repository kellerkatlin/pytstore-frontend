import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { PurchaseQuery, PurchaseRequest, PurchaseResponse } from '../../models/purchase.model';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    private readonly baseUrl = `${environment.api}/purchase`;
    private readonly http = inject(HttpClient);

    getPurchases(query: PurchaseQuery): Observable<ApiResponsePaginated<PurchaseResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof PurchaseQuery] !== undefined) {
                params = params.set(key, query[key as keyof PurchaseQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<PurchaseResponse>>(`${this.baseUrl}`, { params });
    }

    updatePurchase(id: number, product: PurchaseRequest): Observable<ApiResponse<PurchaseResponse>> {
        return this.http.put<ApiResponse<PurchaseResponse>>(`${this.baseUrl}/${id}`, product);
    }

    createPurchaseUniqueProduct(product: PurchaseRequest): Observable<ApiResponse<PurchaseResponse>> {
        return this.http.post<ApiResponse<PurchaseResponse>>(`${this.baseUrl}`, product);
    }

    confirmProductItemArrival(productId: number): Observable<ApiResponse<void>> {
        return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${productId}/confirm`, {});
    }

    deletePurchase(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
