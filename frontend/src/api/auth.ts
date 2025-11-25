import { apiClient } from './client';
import type { SignupRequest, LoginRequest, AuthResponse, TokenResponse, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth';

export const authApi = {
    signup: async (data: SignupRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/signup', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    refreshToken: async (data: RefreshTokenRequest): Promise<TokenResponse> => {
        const response = await apiClient.post<TokenResponse>('/auth/refresh', data);
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
        await apiClient.post('/auth/forgot-password', data);
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await apiClient.post('/auth/reset-password', data);
    },
};
