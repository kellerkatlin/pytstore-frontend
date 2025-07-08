export interface SalesQuery {
    page?: number;
    limit?: number;
    status?: SalesStatus;
    startDate?: Date | null;
    endDate?: Date | null;
}

export interface ItemsQuery {
    search?: string;
    page?: number;
    limit?: number;
}
export interface SaleResponse {
    id: number;
    userId: number;
    productId: number;
    productItemId: number;
    purchaseItemId: number | null;
    quantity: number;
    notes: string | null;
    salePrice: number;
    totalAmount: number;
    costTotal: number;
    profitTotal: number;
    commissionBasedOnProfit: boolean;
    createdAt: string;
    customerId: number;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    status: SalesStatus;
    type: SalesType;
    variantId: number | null;
    customer: {
        id: number;
        name: string;
        email: string;
        phone: string;
        createdAt: string;
        password: string;
        isTemporaryPassword: boolean;
    };
    product: {
        id: number;
        title: string;
        description: string;
        categoryId: number;
        brandId: number;
        isActive: boolean;
        isPreorder: boolean;
        commissionValue: number;
        commissionType: 'PERCENT' | string;
        createdAt: string;
        updatedAt: string;
        status: 'ACTIVE' | string;
    };
    user: {
        id: number;
        name: string;
        username: string | null;
        email: string;
        password: string;
        roleId: number;
        referralCode: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        createdBy: number | null;
        updatedBy: number | null;
        recoveryExpires: string | null;
        recoveryToken: string | null;
        lastName: string | null;
    };
    commission: {
        id: number;
        saleId: number;
        userId: number;
        amount: number;
        createdAt: string;
        status: CommissionStatus;
    };
}

export interface SaleRequest {
    customerId: number;
    userId: number;
    type: SalesType | null;
    referralCode: string | null;
    notes: string | null;
    items: SaleItem[];
}

export interface SaleItem {
    productId: number;
    variantId: number | null;
    productItemId: number | null;
    quantity: number;
    salePrice: number;
}

export interface ProductItemAttribute {
    name: string;
    value: string;
}

export interface ProductItem {
    id: number;
    type: TypeProductItem;
    productId: number;
    quantity: number;
    variantId: number | null;
    sku: string;
    name: string;
    imageUrl: string;
    serialCode: string;
    salePrice: number;
    stock: number;
    attributes: ProductItemAttribute[];
}

export type TypeProductItem = 'VARIANT' | 'UNIQUE';

export type SalesStatus = 'PENDING' | 'APPROVED' | 'IN_PROCESS' | 'PAID' | 'COMPLETED' | 'CANCELED' | 'REFUNDED';

export type SalesType = 'REGULAR' | 'PREORDER';

export type CommissionStatus = 'PENDING' | 'PAID';

export interface PaySaleDto {
    paymentMethodId: number | null;

    documentUrl: string | null;
}
