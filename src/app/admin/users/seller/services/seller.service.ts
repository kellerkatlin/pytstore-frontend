import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { SellerQuery, SellerRequest, SellerResponse } from '../models/seller.model';

@Injectable({
    providedIn: 'root'
})
export class SellerService {
    private readonly baseUrl = `${environment.api}/seller`;
    private readonly http = inject(HttpClient);

    getSellers(query: SellerQuery): Observable<ApiResponsePaginated<SellerResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof SellerQuery] !== undefined) {
                params = params.set(key, query[key as keyof SellerQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<SellerResponse>>(`${this.baseUrl}`, { params });
    }

    getSellerById(id: number): Observable<ApiResponse<SellerResponse>> {
        return this.http.get<ApiResponse<SellerResponse>>(`${this.baseUrl}/${id}`);
    }

    updateSeller(id: number, brand: SellerRequest): Observable<ApiResponse<SellerResponse>> {
        return this.http.put<ApiResponse<SellerResponse>>(`${this.baseUrl}/${id}`, brand);
    }

    createSeller(brand: SellerRequest): Observable<ApiResponse<SellerResponse>> {
        return this.http.post<ApiResponse<SellerResponse>>(`${this.baseUrl}`, brand);
    }

    deleteSeller(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
