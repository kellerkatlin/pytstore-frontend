export interface UniqueProductQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    condition?: string;
    functionality?: string;
}
