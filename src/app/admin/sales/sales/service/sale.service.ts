import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { ItemsQuery, PaySaleDto, ProductItem, SaleRequest, SaleResponse, SalesQuery } from '../models/sale';
import { SaleCostRequest } from '../models/cost';

@Injectable({
    providedIn: 'root'
})
export class SaleService {
    private readonly baseUrl = `${environment.api}/sale`;
    private readonly http = inject(HttpClient);

    getSales(query: SalesQuery): Observable<ApiResponsePaginated<SaleResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof SalesQuery] !== undefined) {
                params = params.set(key, query[key as keyof SalesQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<SaleResponse>>(`${this.baseUrl}`, { params });
    }

    getSaleById(saleId: number): Observable<ApiResponse<SaleResponse>> {
        return this.http.get<ApiResponse<SaleResponse>>(`${this.baseUrl}/${saleId}`);
    }

    createSale(sale: SaleRequest): Observable<ApiResponse<SaleResponse>> {
        return this.http.post<ApiResponse<SaleResponse>>(`${this.baseUrl}`, sale);
    }

    paySale(saleId: number, sale: PaySaleDto): Observable<ApiResponse<void>> {
        return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${saleId}/pay`, sale);
    }

    appoveSale(id: number, costs: SaleCostRequest): Observable<ApiResponse<void>> {
        return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/approve`, costs);
    }

    prepareSale(id: number): Observable<ApiResponse<void>> {
        return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/prepare`, {});
    }
    completeSale(id: number): Observable<ApiResponse<void>> {
        return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/complete`, {});
    }

    rejectSale(id: number): Observable<ApiResponse<void>> {
        return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/reject`, {});
    }

    searchItems(query: ItemsQuery): Observable<ApiResponsePaginated<ProductItem>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof ItemsQuery] !== undefined) {
                params = params.set(key, query[key as keyof ItemsQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<ProductItem>>(`${this.baseUrl}/items/search`, { params });
    }
}
