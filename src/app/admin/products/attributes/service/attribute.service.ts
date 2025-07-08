import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { AttributeQuery, AttributeRequest, AttributeResponse } from '../models/attribute.model';

@Injectable({
    providedIn: 'root'
})
export class AttributeService {
    private readonly baseUrl = `${environment.api}/attribute`;
    private readonly http = inject(HttpClient);

    getAttributes(query: AttributeQuery): Observable<ApiResponsePaginated<AttributeResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof AttributeQuery] !== undefined) {
                params = params.set(key, query[key as keyof AttributeQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<AttributeResponse>>(`${this.baseUrl}`, { params });
    }

    getAttributeById(id: number): Observable<ApiResponse<AttributeResponse>> {
        return this.http.get<ApiResponse<AttributeResponse>>(`${this.baseUrl}/${id}`);
    }

    updateAttribute(id: number, attribute: AttributeRequest): Observable<ApiResponse<AttributeResponse>> {
        return this.http.put<ApiResponse<AttributeResponse>>(`${this.baseUrl}/${id}`, attribute);
    }

    createAttribute(attribute: AttributeRequest): Observable<ApiResponse<AttributeResponse>> {
        return this.http.post<ApiResponse<AttributeResponse>>(`${this.baseUrl}`, attribute);
    }

    deleteAttribute(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
