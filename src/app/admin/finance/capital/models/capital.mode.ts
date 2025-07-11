export interface CapitalTransactionQuery {
    account?: CapitalAccountName | null;
    type?: CapitalType | null;
    referenceType?: CapitalSourceType | null;
    page?: number | null;
    limit?: number;
    startDate?: Date | null;
    endDate?: Date | null;
}

export interface TransactionResponse {
    id: number;
    type: string;
    amount: 200;
    description: string;
    referenceId?: number | null;
    createdAt: string;
    accountId: number;
    expenseId?: number | null;
    referenceType: CapitalSourceType;
    originAccount?: { id: number; name: CapitalAccountName } | null;
    account: {
        id: 1;
        name: CapitalAccountName;
        description: string;
    };
}

export interface CreateTransaction {
    type: CapitalType;
    account: CapitalAccountName;
    createdAt: Date;
    amount: number;
    description: string;
    referenceType: CapitalSourceType;
}

export type CapitalSourceType = 'PURCHASE' | 'SALE' | 'RETURN' | 'WITHDRAWAL' | 'SHIPMENT' | 'EXPENSE' | 'OTHER';

export type CapitalAccountName = 'CASH' | 'INVENTORY' | 'COMMISSIONS';

export type CapitalType = 'INJECTION' | 'PURCHASE_EXPENSE' | 'OPERATIONAL_EXPENSE' | 'SALE_PROFIT' | 'DEVOLUTION_COST' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT';

export interface FinancialSummaryDto {
    capital: {
        account: 'CASH' | 'INVENTORY' | 'COMMISSIONS';
        total: number;
    }[];
    totalSales: number;
    capitalInjection: number;
    netProfit: number;
}
