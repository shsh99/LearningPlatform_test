import axios from 'axios';
import type { TokenResponse, RefreshTokenRequest } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                    .then((accessToken) => {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post<TokenResponse>(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken } as RefreshTokenRequest
                );

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                failedRequestsQueue.forEach((request) => request.resolve(newAccessToken));
                failedRequestsQueue = [];

                return apiClient(originalRequest);
            } catch (refreshError) {
                failedRequestsQueue.forEach((request) => request.reject(refreshError));
                failedRequestsQueue = [];
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
