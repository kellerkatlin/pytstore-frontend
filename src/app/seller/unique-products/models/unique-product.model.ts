import { ProductItemStatus } from '../../../admin/products/unique-products/models/unique-product.model';

export interface UniqueProductDto {
    id: number;
    productId: number;
    productTitle: string;
    brandName: string;
    serialCode: string;
    condition: string;
    functionality: string;
    status: ProductItemStatus;
    salePrice: number;
    sold: boolean;
    profit: number;
    available: boolean;
    createdAt: string; // ISO Date
    imagenUrl: string | null; // URL of the product image
}
