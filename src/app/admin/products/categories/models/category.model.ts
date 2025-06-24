export interface CategoryQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    condition?: string;
    functionality?: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
    status: STATUS;
}

export interface CategoryRequest {
    name: string;
    status: STATUS;
}

export type STATUS = 'ACTIVE' | 'INACTIVE';
