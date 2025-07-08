import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { PaymentMethodResponse } from '../models/payment-method.model';
import { ApiResponse } from '../../core/models/api-response.interface';

@Injectable({
    providedIn: 'root'
})
export class PaymentMethodService {
    private readonly baseUrl = `${environment.api}/payment-method`;
    private readonly http = inject(HttpClient);

    getMethodPayments(): Observable<ApiResponse<PaymentMethodResponse[]>> {
        return this.http.get<ApiResponse<PaymentMethodResponse[]>>(`${this.baseUrl}`);
    }
}
