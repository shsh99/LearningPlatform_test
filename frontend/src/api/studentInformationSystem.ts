import { apiClient } from './client';
import type { StudentInformationSystem } from '../types/studentInformationSystem';

export const getStudentInformationSystems = async (): Promise<StudentInformationSystem[]> => {
  const response = await apiClient.get<StudentInformationSystem[]>('/student-information-system');
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
