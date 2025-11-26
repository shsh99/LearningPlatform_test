import { apiClient } from './client';
import type { UserSearchResponse } from '../types/user';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'OPERATOR' | 'ADMIN';
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
