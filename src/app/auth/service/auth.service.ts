import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { LoginResponse, RoleName, UserResponse } from '../models/user.interface';
import { ApiResponse } from '../../core/models/api-response.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly userSubject = new BehaviorSubject<UserResponse | null>(null);
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.api}/auth`;

    public user$ = this.userSubject.asObservable();

    get currentUser(): UserResponse | null {
        const user = this.userSubject.value;
        return user;
    }

    login(email: string, password: string): Observable<UserResponse> {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login-user`, { email, password }).pipe(
            switchMap(() => this.me()),
            map((res) => res.data)
        );
    }

    me(): Observable<ApiResponse<UserResponse>> {
        return this.http.get<ApiResponse<UserResponse>>(`${this.baseUrl}/me`).pipe(
            tap((res) => {
                this.userSubject.next(res.data);
            }),
            catchError(() => {
                this.userSubject.next(null);
                return of({ data: null } as any);
            })
        );
    }

    hasRole(roles: RoleName[]): boolean {
        const role = this.currentUser?.role;
        return role !== undefined && roles.includes(role as RoleName);
    }

    isAuthenticated(): boolean {
        return !!this.currentUser;
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/logout`, {}).pipe(
            tap(() => {
                this.userSubject.next(null);
            })
        );
    }
}
