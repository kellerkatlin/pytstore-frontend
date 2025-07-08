export interface CreatePurchaseDto {
    providerName: string;
    invoiceCode: string;
    purchaseDate: string;

    items: {
        productItemId: number; // ya existe
        unitCost: number; // costo de compra
    }[];
}
