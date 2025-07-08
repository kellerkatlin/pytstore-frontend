import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { ProductAttributeQuery, ProductAttributeResponse } from '../models/productAttribute.model';
import { AttributeValueResponse } from '../../attributes/models/attributeValue.model';
import { AttributeResponse } from '../../attributes/models/attribute.model';

@Injectable({
    providedIn: 'root'
})
export class ProductAttributeService {
    private readonly baseUrl = `${environment.api}/product-attribute`;
    private readonly http = inject(HttpClient);

    getAssignedAttributes(productId: number, query: ProductAttributeQuery): Observable<ApiResponsePaginated<ProductAttributeResponse>> {
        let params = new HttpParams();
        for (const key in query) {
            if (query[key as keyof typeof query] !== undefined) {
                params = params.set(key, query[key as keyof typeof query]!);
            }
        }

        return this.http.get<ApiResponsePaginated<ProductAttributeResponse>>(`${this.baseUrl}/${productId}/attributes`, { params });
    }

    getAssignedAttributeValues(productId: number, attributeId: number, query: ProductAttributeQuery): Observable<ApiResponsePaginated<ProductAttributeResponse>> {
        let params = new HttpParams();
        for (const key in query) {
            if (query[key as keyof typeof query] !== undefined) {
                params = params.set(key, query[key as keyof typeof query]!);
            }
        }

        return this.http.get<ApiResponsePaginated<ProductAttributeResponse>>(`${this.baseUrl}/${productId}/attributes/${attributeId}/values`, { params });
    }

    getUnassignedAttributes(productId: number, query: ProductAttributeQuery): Observable<ApiResponsePaginated<AttributeResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof typeof query] !== undefined) {
                params = params.set(key, query[key as keyof typeof query]!);
            }
        }

        return this.http.get<ApiResponsePaginated<AttributeResponse>>(`${this.baseUrl}/${productId}/unassigned-attributes`, { params });
    }

    getUnassignedValues(productId: number, attributeId: number, query: ProductAttributeQuery): Observable<ApiResponsePaginated<AttributeValueResponse>> {
        let params = new HttpParams();
        for (const key in query) {
            if (query[key as keyof ProductAttributeQuery] !== undefined) {
                params = params.set(key, query[key as keyof ProductAttributeQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<AttributeValueResponse>>(`${this.baseUrl}/${productId}/attributes/${attributeId}/unassigned-values`, { params });
    }

    assignAttributeToProduct(productId: number, attributeId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${productId}/attributes`, { attributeId });
    }

    assignValuesToAttribute(productId: number, attributeId: number, valueId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${productId}/attributes/${attributeId}/values`, { valueId });
    }

    unassignAttributeFromProduct(productId: number, attributeId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${productId}/attributes/${attributeId}`);
    }

    unassigValuesFromAttribute(productId: number, attributeId: number, valueId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${productId}/attributes/${attributeId}/values/${valueId}`);
    }
}
