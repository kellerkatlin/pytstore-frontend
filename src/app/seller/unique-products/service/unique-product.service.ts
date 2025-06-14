import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { UniqueProductResponse } from '../models/unique-product.model';
import { UniqueProductQueryDto } from '../models/unique-product-query.dto';
import { UniqueProductDetailResponse } from '../models/unique-product-detail';

@Injectable({
    providedIn: 'root'
})
export class UniqueProductService {
    private readonly baseUrl = `${environment.api}/product-item-seller`;
    private readonly http = inject(HttpClient);

    getUniqueProducts(query: UniqueProductQueryDto): Observable<ApiResponse<UniqueProductResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof UniqueProductQueryDto] !== undefined) {
                params = params.set(key, query[key as keyof UniqueProductQueryDto]! as any);
            }
        }

        return this.http.get<ApiResponse<UniqueProductResponse>>(`${this.baseUrl}`, { params });
    }

    getUniqueProductDetail(id: string): Observable<ApiResponse<UniqueProductDetailResponse>> {
        return this.http.get<ApiResponse<UniqueProductDetailResponse>>(`${this.baseUrl}/${id}`);
    }
}
