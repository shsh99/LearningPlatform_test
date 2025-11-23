import { apiClient } from './client';
import type { UserProfile } from '../types/userProfile';

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/users/me/profile');
  return response.data;
};
