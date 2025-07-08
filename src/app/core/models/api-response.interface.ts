// 📁 src/app/core/models/api-response.model.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string;
    statusCode: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    lastPage: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface ApiResponsePaginated<T> {
    success: boolean;
    data: PaginatedResponse<T>;
    message: string;
    statusCode: number;
}
