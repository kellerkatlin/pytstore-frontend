export interface AttributeResponse {
    id: number;
    name: string;
    status: STATUS;
}

export interface AttributeRequest {
    name: string;
    status: STATUS;
}

export type STATUS = 'ACTIVE' | 'INACTIVE';

export interface AttributeQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}
