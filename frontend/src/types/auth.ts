export interface SignupRequest {
    email: string;
    password: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    id: number;
    email: string;
    name: string;
    token: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
}
