import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { AttributeQuery } from '../models/attribute.model';
import { AttributeValueRequest, AttributeValueResponse } from '../models/attributeValue.model';

@Injectable({
    providedIn: 'root'
})
export class AttributeValueService {
    private readonly baseUrl = `${environment.api}/attribute-value`;
    private readonly http = inject(HttpClient);

    getAttributeValuesByAttribute(attributeId: number, query: AttributeQuery): Observable<ApiResponsePaginated<AttributeValueResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof AttributeQuery] !== undefined) {
                params = params.set(key, query[key as keyof AttributeQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<AttributeValueResponse>>(`${this.baseUrl}/${attributeId}`, { params });
    }

    getAttributeValueById(id: number): Observable<ApiResponse<AttributeValueResponse>> {
        return this.http.get<ApiResponse<AttributeValueResponse>>(`${this.baseUrl}/${id}/value`);
    }

    updateAttributeValue(id: number, attribute: AttributeValueRequest): Observable<ApiResponse<AttributeValueResponse>> {
        return this.http.put<ApiResponse<AttributeValueResponse>>(`${this.baseUrl}/attribute-values/${id}`, attribute);
    }

    createAttributeValue(attributeId: number, attribute: AttributeValueRequest): Observable<ApiResponse<AttributeValueResponse>> {
        return this.http.post<ApiResponse<AttributeValueResponse>>(`${this.baseUrl}/${attributeId}/values`, attribute);
    }

    deleteAttributeValue(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
