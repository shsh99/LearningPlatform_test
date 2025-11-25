export interface SignupRequest {
    email: string;
    password: string;
    name: string;
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

export interface AuthResponse {
    id: number;
    email: string;
    name: string;
    role: 'USER' | 'OPERATOR' | 'ADMIN';
    tokens: TokenResponse;
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: 'USER' | 'OPERATOR' | 'ADMIN';
}
