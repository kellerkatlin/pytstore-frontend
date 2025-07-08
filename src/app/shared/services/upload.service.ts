import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

interface PresignedUrlResponse {
    url: string; // URL firmada para el PUT
    finalUrl: string; // URL pública para guardar en la BD
}

@Injectable({ providedIn: 'root' })
export class UploadService {
    private readonly baseUrl = `${environment.api}/upload`;
    private readonly http = inject(HttpClient);

    getPresignedUrl(filename: string, contentType: string): Observable<PresignedUrlResponse> {
        return this.http.post<PresignedUrlResponse>(`${this.baseUrl}/presign`, { filename, contentType });
    }

    uploadAndGetFinalUrl$(file: File): Observable<string> {
        return this.http
            .post<{ data: PresignedUrlResponse }>(`${this.baseUrl}/presign`, {
                filename: file.name,
                contentType: file.type
            })
            .pipe(
                switchMap((res) =>
                    from(
                        fetch(res.data.url, {
                            method: 'PUT',
                            headers: { 'Content-Type': file.type },
                            body: file
                        }).then(() => res.data.finalUrl)
                    )
                )
            );
    }

    deleteFileByUrl$(imageUrl: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/remove-by-url`, {
            body: { imageUrl }
        });
    }
}
