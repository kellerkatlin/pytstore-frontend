export interface BrandQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

export interface BrandResponse {
    id: number;
    name: string;
    status: STATUS;
}

export interface BrandRequest {
    name: string;
    status: STATUS;
}

export type STATUS = 'ACTIVE' | 'INACTIVE';
