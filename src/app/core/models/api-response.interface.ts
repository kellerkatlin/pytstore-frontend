// 📁 src/app/core/models/api-response.model.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string;
    statusCode: number;
}
