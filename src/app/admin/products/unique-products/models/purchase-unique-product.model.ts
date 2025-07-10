export interface CreatePurchaseDto {
    providerName: string;
    invoiceCode: string;
    purchaseDate: string;
    documentUrl: string | null;

    items: {
        productItemId: number; // ya existe
        unitCost: number; // costo de compra
    }[];
}
