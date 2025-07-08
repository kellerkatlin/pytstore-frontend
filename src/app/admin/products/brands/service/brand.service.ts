import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { BrandQuery, BrandRequest, BrandResponse } from '../models/brand.model';

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    private readonly baseUrl = `${environment.api}/brand`;
    private readonly http = inject(HttpClient);

    getBrands(query: BrandQuery): Observable<ApiResponsePaginated<BrandResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof BrandQuery] !== undefined) {
                params = params.set(key, query[key as keyof BrandQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<BrandResponse>>(`${this.baseUrl}`, { params });
    }

    getBrandById(id: number): Observable<ApiResponse<BrandResponse>> {
        return this.http.get<ApiResponse<BrandResponse>>(`${this.baseUrl}/${id}`);
    }

    updateBrand(id: number, brand: BrandRequest): Observable<ApiResponse<BrandResponse>> {
        return this.http.put<ApiResponse<BrandResponse>>(`${this.baseUrl}/${id}`, brand);
    }

    createBrand(brand: BrandRequest): Observable<ApiResponse<BrandResponse>> {
        return this.http.post<ApiResponse<BrandResponse>>(`${this.baseUrl}`, brand);
    }

    deleteBrand(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
