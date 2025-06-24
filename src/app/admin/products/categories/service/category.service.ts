import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { CategoryQuery, CategoryRequest, CategoryResponse } from '../models/category.model';
import { AttributeResponse } from '../../attributes/models/attribute.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly baseUrl = `${environment.api}/category`;
    private readonly http = inject(HttpClient);

    getCategories(query: CategoryQuery): Observable<ApiResponsePaginated<CategoryResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof CategoryQuery] !== undefined) {
                params = params.set(key, query[key as keyof CategoryQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<CategoryResponse>>(`${this.baseUrl}`, { params });
    }

    getCategoryById(id: number): Observable<ApiResponse<CategoryResponse>> {
        return this.http.get<ApiResponse<CategoryResponse>>(`${this.baseUrl}/${id}`);
    }

    updateCategory(id: number, category: CategoryRequest): Observable<ApiResponse<CategoryResponse>> {
        return this.http.put<ApiResponse<CategoryResponse>>(`${this.baseUrl}/${id}`, category);
    }

    createCategory(category: CategoryRequest): Observable<ApiResponse<CategoryResponse>> {
        return this.http.post<ApiResponse<CategoryResponse>>(`${this.baseUrl}`, category);
    }

    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    getAttributesByCategory(categoryId: number, query: CategoryQuery): Observable<ApiResponsePaginated<AttributeResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof CategoryQuery] !== undefined) {
                params = params.set(key, query[key as keyof CategoryQuery]! as any);
            }
        }
        return this.http.get<ApiResponsePaginated<AttributeResponse>>(`${this.baseUrl}/${categoryId}/attributes`, { params });
    }

    getUnassignAttributes(categoryId: number, query: CategoryQuery): Observable<ApiResponsePaginated<AttributeResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof CategoryQuery] !== undefined) {
                params = params.set(key, query[key as keyof CategoryQuery]! as any);
            }
        }
        return this.http.get<ApiResponsePaginated<AttributeResponse>>(`${this.baseUrl}/${categoryId}/unassignAttributes`, { params });
    }

    assignAttribute(categoryId: number, attributeId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${categoryId}/attributes/${attributeId}`, {});
    }

    unassignAttribute(categoryId: number, attributeId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${categoryId}/attributes/${attributeId}`);
    }
}
