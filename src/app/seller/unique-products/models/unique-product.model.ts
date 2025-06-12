import { PaginatedResponse } from '../../../shared/models/pagination.model';

export interface UniqueProductDto {
    id: number;
    productId: number;
    productTitle: string;
    brandName: string;
    serialCode: string;
    condition: string;
    functionality: string;
    salePrice: number;
    sold: boolean;
    profit: number;
    available: boolean;
    createdAt: string; // ISO Date
    imagenUrl: string | null; // URL of the product image
}

export type UniqueProductResponse = PaginatedResponse<UniqueProductDto>;
