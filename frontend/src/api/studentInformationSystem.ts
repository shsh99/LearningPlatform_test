import { apiClient } from './client';
import type { StudentInformationSystem, StudentInformationSystemQuery } from '../types/studentInformationSystem';

export const getStudentInformationSystems = async (
  query?: StudentInformationSystemQuery
): Promise<StudentInformationSystem[]> => {
  const params = new URLSearchParams();
  if (query?.userKey) params.append('userKey', query.userKey.toString());
  if (query?.timeKey) params.append('timeKey', query.timeKey.toString());

  const response = await apiClient.get<StudentInformationSystem[]>(
    `/student-information-system${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
};
