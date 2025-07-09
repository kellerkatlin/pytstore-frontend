import { CommissionType } from '../../unique-products/models/unique-product.model';

export interface ProductQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    condition?: string;
    functionality?: string;
}

export interface ProductResponse {
    id: number;
    title: string;
    description: string;
    commissionType: COMMISSIONTYPE;
    commissionValue: number;
    categoryId: number;
    brandId: number;
    status: STATUS;
    createdAt: string;
    updatedAt: string;
    category: {
        id: number;
        name: string;
    };
    brand: {
        id: number;
        name: string;
    };
    images: ImageProduct[];
}

export type STATUS = 'ACTIVE' | 'DISABLED' | 'PAUSED';

export type COMMISSIONTYPE = 'PERCENT' | 'FIXED';

export interface ImageProduct {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
}

export interface ProductRequest {
    title: string;
    description: string | null;
    categoryId: number;
    status: STATUS;
    brandId: number;
    commissionType: CommissionType;
    commissionValue: number;
    images: { imageUrl: string; isPrimary?: boolean }[];
    gainType: CommissionType;
    gainValue: number;
}

export interface AttributesProduct {
    productId: number;
    attributes: {
        attributeId: number;
        name: string;
        values: {
            valueId: number;
            value: string;
        }[];
    }[];
}
