import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { WithdrawalQuery, WithdrawalRequest, WithdrawalResponse } from '../models/withdrawal.model';
import { ApiResponse, ApiResponsePaginated } from '../../../core/models/api-response.interface';

@Injectable({
    providedIn: 'root'
})
export class WithDrawalService {
    private readonly baseUrl = `${environment.api}/withdrawal`;
    private readonly http = inject(HttpClient);

    getMyWithDrawal(query: WithdrawalQuery): Observable<ApiResponsePaginated<WithdrawalResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof WithdrawalQuery] !== undefined) {
                params = params.set(key, query[key as keyof WithdrawalQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<WithdrawalResponse>>(`${this.baseUrl}/my`, { params });
    }

    requestWithdrawal(request: WithdrawalRequest): Observable<ApiResponse<WithdrawalResponse>> {
        return this.http.post<ApiResponse<WithdrawalResponse>>(`${this.baseUrl}`, request);
    }
}
