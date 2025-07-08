export interface ProductAttributeQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ProductAttributeResponse {
    id: number;
    attributeId: number;
    name: string;
}
