export interface CommisionSummary {
    totalEarned: number;
    totalPaid: number;
    totalPending: number;
    pendingWithdrawals: number;
    availableToWithdraw: number;
    canWithdraw: boolean;
}
