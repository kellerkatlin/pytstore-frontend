export interface PaginationMeta {
    total: number;
    page: number;
    lastPage: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
