export interface UniqueProductDetailResponse {
    id: string;
    productTitle: string;
    brandName: string;
    serialCode: string;
    condition: string;
    functionality: string;
    salePrice: number;
    profit: number;
    description: string;
    batteryHealth?: number;
    createdAt: string;
    attributes: {
        name: string;
        value: string;
    }[];
    images: string[];
}
