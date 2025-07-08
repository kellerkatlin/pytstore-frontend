import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { WithdrawalResponse, WithdrawalStatus } from '../model/withdrawal.model';
import { WithdrawalQuery } from '../../../../seller/sales/models/withdrawal.model';

@Injectable({
    providedIn: 'root'
})
export class WithdrawalService {
    private readonly baseUrl = `${environment.api}/withdrawal`;
    private readonly http = inject(HttpClient);

    getWithdrawal(query: WithdrawalQuery): Observable<ApiResponsePaginated<WithdrawalResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof WithdrawalQuery] !== undefined) {
                params = params.set(key, query[key as keyof WithdrawalQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<WithdrawalResponse>>(`${this.baseUrl}`, { params });
    }

    updateStatus(id: number, dto: { status: WithdrawalStatus }): Observable<ApiResponse<void>> {
        return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}`, dto);
    }

    // updateWithdrawal(id: number, brand: WithdrawalRequest): Observable<ApiResponse<WithdrawalResponse>> {
    //     return this.http.put<ApiResponse<WithdrawalResponse>>(`${this.baseUrl}/${id}`, brand);
    // }

    // createWithdrawal(brand: WithdrawalRequest): Observable<ApiResponse<WithdrawalResponse>> {
    //     return this.http.post<ApiResponse<WithdrawalResponse>>(`${this.baseUrl}`, brand);
    // }

    // deleteWithdrawal(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.baseUrl}/${id}`);
    // }
}
