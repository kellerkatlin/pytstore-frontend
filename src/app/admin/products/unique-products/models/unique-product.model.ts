import { PaginatedResponse } from '../../../../core/models/api-response.interface';

export interface UninqueProductQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

export interface UniqueProductResponse {
    id: string;
    productTitle: string;
    brandName: string;
    serialCode: string;
    salePrice: number;
    profit: number;
    taxType: TaxAffectationType;
    commissionType: CommissionType;
    description: string;
    productId: number;
    createdAt: string;
    gainType: CommissionType;
    unitCost: number;
    gainValue: number;
    attributes: {
        attributeId: number;
        valueId: number;
    }[];
    images: { id: number; imageUrl: string; isPrimary?: boolean }[];
}

export interface UniqueProductState {
    loading: boolean;
    data: PaginatedResponse<UniqueProductResponse> | null;
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    order: 'asc' | 'desc';
    uniqueProductDialog: boolean;
    selectedProductId: number | null;
}

export interface UniqueProductRequest {
    productId: number;
    serialCode: string;

    salePrice: number;
    images: { imageUrl: string; isPrimary?: boolean }[];
    description: string;
    taxType: TaxAffectationType;
    attributes: {
        attributeId: number;
        valueId: number;
    }[];
    commissionValue: number;
    commissionType: CommissionType;
    gainType: CommissionType;
    gainValue: number;
}

export type ProductCondition = 'EXCELLENT' | 'NEW' | 'GOOD' | 'FAIR';

export type CommissionType = 'FIXED' | 'PERCENT';

export type ProductItemStatus = 'NOT_AVAILABLE' | 'ORDERED' | 'IN_STOCK' | 'SOLD';

export type TaxAffectationType = 'GRAVADO' | 'INAFECTO' | 'EXONERADO';
