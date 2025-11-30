import { apiClient } from './client';
import type { UserSearchResponse, CreateTenantAdminRequest, CreateOperatorRequest, UserResponse } from '../types/user';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'OPERATOR' | 'ADMIN' | 'TENANT_ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

/**
 * User API 클라이언트
 */

// 전체 사용자 목록 조회
export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};

// 사용자 단건 조회
export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
};

// 회원 탈퇴
export const withdrawAccount = async (password: string): Promise<void> => {
  await apiClient.delete('/users/me', {
    data: { password }
  });
};

// 사용자 검색 (관리자용)
export const searchUsers = async (query: string): Promise<UserSearchResponse[]> => {
  const response = await apiClient.get<UserSearchResponse[]>('/users/search', {
    params: { q: query }
  });
  return response.data;
};

// 테넌트 어드민 생성 (SUPER_ADMIN 전용)
export const createTenantAdmin = async (request: CreateTenantAdminRequest): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/users/tenant-admins', request);
  return response.data;
};

// 오퍼레이터 생성 (TENANT_ADMIN 전용)
export const createOperator = async (request: CreateOperatorRequest): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/users/operators', request);
  return response.data;
};

// 테넌트의 오퍼레이터 목록 조회 (TENANT_ADMIN 전용)
export const getOperators = async (): Promise<UserResponse[]> => {
  const response = await apiClient.get<UserResponse[]>('/users/operators');
  return response.data;
};
