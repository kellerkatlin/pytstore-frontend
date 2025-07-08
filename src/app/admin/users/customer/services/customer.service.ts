import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerQuery, CustomerRequest, CustomerResponse } from '../models/customer.model';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private readonly baseUrl = `${environment.api}/customer`;
    private readonly http = inject(HttpClient);

    getCustomers(query: CustomerQuery): Observable<ApiResponsePaginated<CustomerResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof CustomerQuery] !== undefined) {
                params = params.set(key, query[key as keyof CustomerQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<CustomerResponse>>(`${this.baseUrl}`, { params });
    }

    getCustomerById(id: number): Observable<ApiResponse<CustomerResponse>> {
        return this.http.get<ApiResponse<CustomerResponse>>(`${this.baseUrl}/${id}`);
    }

    updateCustomer(id: number, brand: CustomerRequest): Observable<ApiResponse<CustomerResponse>> {
        return this.http.put<ApiResponse<CustomerResponse>>(`${this.baseUrl}/${id}`, brand);
    }

    createCustomer(brand: CustomerRequest): Observable<ApiResponse<CustomerResponse>> {
        return this.http.post<ApiResponse<CustomerResponse>>(`${this.baseUrl}`, brand);
    }

    deleteCustomer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
