export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    tenantCode?: string; // 선택적: 회사 코드 (테넌트 연결용)
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export type UserRole = 'USER' | 'INSTRUCTOR' | 'OPERATOR' | 'ADMIN' | 'TENANT_ADMIN' | 'SUPER_ADMIN';

export interface AuthResponse {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    tenantId: number | null;
    tenantCode: string | null;
    tokens: TokenResponse;
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    tenantId?: number | null;
    tenantCode?: string | null;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
