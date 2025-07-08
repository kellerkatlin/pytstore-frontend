export interface SaleCostRequest {
    additionalCosts?: SaleExtraCostDto[];
}

export interface SaleExtraCostDto {
    type: CostDetailType;

    description: string;

    amount: number;

    documentUrl: string | null;
}

export type CostDetailType = 'SHIPPING' | 'TAX' | 'ADDITIONAL' | 'OTHER';
