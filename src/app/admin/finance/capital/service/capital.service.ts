import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../../core/models/api-response.interface';
import { CapitalTransactionQuery, CreateTransaction, TransactionResponse } from '../models/capital.mode';

@Injectable({
    providedIn: 'root'
})
export class CapitalService {
    private readonly baseUrl = `${environment.api}/capital`;
    private readonly http = inject(HttpClient);

    getAllTransactions(query: CapitalTransactionQuery): Observable<ApiResponsePaginated<TransactionResponse>> {
        let params = new HttpParams();

        for (const key in query) {
            if (query[key as keyof CapitalTransactionQuery] !== undefined) {
                params = params.set(key, query[key as keyof CapitalTransactionQuery]! as any);
            }
        }

        return this.http.get<ApiResponsePaginated<TransactionResponse>>(`${this.baseUrl}/transactions`, { params });
    }

    createTrasaction(body: CreateTransaction): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}`, body);
    }
}
