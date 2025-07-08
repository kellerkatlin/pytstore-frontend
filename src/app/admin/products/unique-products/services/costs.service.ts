import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse } from '../../../../core/models/api-response.interface';
import { ProductItemCostRequest, ProductItemCostResponse } from '../models/costs.model';

@Injectable({
    providedIn: 'root'
})
export class ProductItemCostService {
    private readonly baseUrl = `${environment.api}/product-items`;
    private readonly http = inject(HttpClient);

    findAll(itemId: number): Observable<ApiResponse<ProductItemCostResponse[]>> {
        return this.http.get<ApiResponse<ProductItemCostResponse[]>>(`${this.baseUrl}/${itemId}/costs`);
    }

    get(itemId: number, costId: number): Observable<ApiResponse<ProductItemCostResponse>> {
        return this.http.get<ApiResponse<ProductItemCostResponse>>(`${this.baseUrl}/${itemId}/costs/${costId}`);
    }

    create(itemId: number, dto: ProductItemCostRequest): Observable<ApiResponse<ProductItemCostResponse>> {
        return this.http.post<ApiResponse<ProductItemCostResponse>>(`${this.baseUrl}/${itemId}/costs`, dto);
    }

    update(itemId: number, costId: number, dto: ProductItemCostRequest): Observable<ApiResponse<ProductItemCostResponse>> {
        return this.http.patch<ApiResponse<ProductItemCostResponse>>(`${this.baseUrl}/${itemId}/costs/${costId}`, dto);
    }

    delete(itemId: number, costId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${itemId}/costs/${costId}`);
    }
}
