export interface LoginResponse {
    id: number;
    name: string;
    role: RoleName | null;
}

export interface UserResponse {
    sub: number;
    email: string;
    role: RoleName | null;
}

export enum RoleName {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN',
    SELLER = 'SELLER',
    RECRUITER = 'RECRUITER',
    STOCK = 'STOCK',
    MARKETING = 'MARKETING'
}
