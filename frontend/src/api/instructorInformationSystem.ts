import { apiClient } from './client';
import type { InstructorInformationSystem, InstructorInformationSystemQuery } from '../types/instructorInformationSystem';

export const getInstructorInformationSystems = async (
  query?: InstructorInformationSystemQuery
): Promise<InstructorInformationSystem[]> => {
  const params = new URLSearchParams();
  if (query?.userKey) params.append('userKey', query.userKey.toString());
  if (query?.timeKey) params.append('timeKey', query.timeKey.toString());

  const response = await apiClient.get<InstructorInformationSystem[]>(
    `/instructor-information-system${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
};
