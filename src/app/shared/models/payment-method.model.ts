export interface PaymentMethodResponse {
    id: number;
    name: string;
    isActive: boolean;
    supportsInstallments: boolean;
    createdAt: string;
}
