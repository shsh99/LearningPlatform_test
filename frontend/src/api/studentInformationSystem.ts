import { apiClient } from './client';
import type { StudentInformationSystem, SISPageResponse } from '../types/studentInformationSystem';

interface SISQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// 페이지네이션 조회 (기본)
export const getStudentInformationSystems = async (
  params: SISQueryParams = {}
): Promise<SISPageResponse> => {
  const { page = 0, size = 10, sort = 'id', direction = 'desc' } = params;
  const response = await apiClient.get<SISPageResponse>('/student-information-system', {
    params: { page, size, sort, direction }
  });
  return response.data;
};

// 전체 조회 (페이지네이션 없음)
export const getAllStudentInformationSystems = async (): Promise<StudentInformationSystem[]> => {
  const response = await apiClient.get<StudentInformationSystem[]>('/student-information-system/all');
  return response.data;
};

export const getStudentInformationSystemDetail = async (id: number): Promise<StudentInformationSystem> => {
  const response = await apiClient.get<StudentInformationSystem>(`/student-information-system/${id}`);
  return response.data;
};

export const cancelEnrollment = async (id: number): Promise<void> => {
  await apiClient.post(`/student-information-system/${id}/cancel`);
};

export const completeEnrollment = async (id: number): Promise<void> => {
  await apiClient.post(`/student-information-system/${id}/complete`);
};
