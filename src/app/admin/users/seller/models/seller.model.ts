export interface SellerResponse {
    id: number;
    businessName: string;
    storeName: string;
    ruc: string;
    description: string;
    logoUrl: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        username: string;
    };
}

export interface SellerRequest {
    email: string;
    password: string | null;
    name: string;
    storeName: string | null;
    phone: string | null;
    businessName: string | null;
    ruc: string | null;
    description: string | null;
    logoUrl: string | null;
}

export interface SellerQuery {
    page?: number;
    limit?: number;
    search?: string;
}
