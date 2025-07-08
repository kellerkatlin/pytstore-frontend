export interface WithdrawalResponse {
    id: number;
    userId: number;
    amount: number;
    note: string | null;
    createdAt: string;
    updatedAt: string;
    status: WithdrawalStatus;
    user: User;
}

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}
