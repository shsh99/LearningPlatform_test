import { apiClient } from './client';
import type {
  InstructorInformationSystem,
  InstructorInformationSystemDetail,
  InstructorInformationSystemQuery
} from '../types/instructorInformationSystem';

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

/**
 * Get detailed IIS records (similar to SIS)
 * Returns instructor info, course info, assignment status, etc.
 */
export const getInstructorInformationSystemsDetailed = async (
  query?: InstructorInformationSystemQuery
): Promise<InstructorInformationSystemDetail[]> => {
  const params = new URLSearchParams();
  if (query?.userKey) params.append('userKey', query.userKey.toString());
  if (query?.timeKey) params.append('timeKey', query.timeKey.toString());

  const response = await apiClient.get<InstructorInformationSystemDetail[]>(
    `/instructor-information-system/detailed${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
};

/**
 * Unassign instructor (cancel assignment)
 */
export const unassignInstructor = async (assignmentId: number): Promise<void> => {
  await apiClient.delete(`/instructor-assignments/${assignmentId}`);
};
