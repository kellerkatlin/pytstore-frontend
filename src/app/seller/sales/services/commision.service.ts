import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { ApiResponse, ApiResponsePaginated } from '../../../core/models/api-response.interface';
import { CommisionSummary } from '../models/commission.model';

@Injectable({
    providedIn: 'root'
})
export class CommisionService {
    private readonly baseUrl = `${environment.api}/commission`;
    private readonly http = inject(HttpClient);

    // getMyWithDrawal(query: WithDrawalQuery): Observable<ApiResponsePaginated<WithDrawalResponse>> {
    //     let params = new HttpParams();

    //     for (const key in query) {
    //         if (query[key as keyof WithDrawalQuery] !== undefined) {
    //             params = params.set(key, query[key as keyof WithDrawalQuery]! as any);
    //         }
    //     }

    //     return this.http.get<ApiResponsePaginated<WithDrawalResponse>>(`${this.baseUrl}/my`, { params });
    // }

    getMySummary(): Observable<ApiResponse<CommisionSummary>> {
        return this.http.get<ApiResponse<CommisionSummary>>(`${this.baseUrl}/summary`);
    }
}
