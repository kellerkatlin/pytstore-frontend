export interface ProductItemCostResponse {
    id: number;
    type: CostDetailType;
    description: string;
    amount: number;
    documentUrl?: string | null;
    createdAt: string;
}

export interface ProductItemCostRequest {
    type: CostDetailType;
    description: string;
    amount: number;
    documentUrl: string | null;
}

export type CostDetailType = 'SHIPPING' | 'TAX' | 'ADDITIONAL' | 'OTHER';
