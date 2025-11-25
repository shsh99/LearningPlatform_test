import { apiClient } from './client';
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest, UserResponse } from '../types/userProfile';

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/users/me/profile');
  return response.data;
};

export const updateMyProfile = async (request: UpdateProfileRequest): Promise<UserResponse> => {
  const response = await apiClient.put<UserResponse>('/users/me/profile', request);
  return response.data;
};

export const changeMyPassword = async (request: ChangePasswordRequest): Promise<void> => {
  await apiClient.put('/users/me/password', request);
};
