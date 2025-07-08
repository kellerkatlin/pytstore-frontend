export interface WithdrawalQuery {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}

export interface WithdrawalResponse {
    status: WithdrawalStatus;
    amount: number;
}

export interface WithdrawalRequest {
    amount: number;
}

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
