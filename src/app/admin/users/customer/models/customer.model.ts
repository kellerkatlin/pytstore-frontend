export interface CustomerResponse {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    dni: string | null;
    customerType: CustomerType | null;
    ruc: string | null;
    addresses: Address[];
}

export interface CustomerRequest {
    name: string;
    dni: string | null;
    customerType: CustomerType | null;
    ruc: string | null;
    email: string | null;
    phone: string | null;
    addresses: Address[];
}

export interface CustomerQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}
export interface Address {
    addressLine: string;
    district: string;
    department: string;
    province: string;
    reference: string;
}

export type CustomerType = 'NATURAL' | 'JURIDICAL';
