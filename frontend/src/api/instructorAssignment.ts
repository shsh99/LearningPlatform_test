import { apiClient } from './client';
import type { InstructorAssignment, AssignInstructorRequest } from '../types/instructorAssignment';

export const assignInstructor = async (request: AssignInstructorRequest): Promise<InstructorAssignment> => {
  const response = await apiClient.post<InstructorAssignment>('/instructor-assignments', request);
  return response.data;
};

export const getInstructorAssignmentById = async (id: number): Promise<InstructorAssignment> => {
  const response = await apiClient.get<InstructorAssignment>(`/instructor-assignments/${id}`);
  return response.data;
};

export const getInstructorAssignmentsByTermId = async (termId: number): Promise<InstructorAssignment[]> => {
  const response = await apiClient.get<InstructorAssignment[]>(`/instructor-assignments/term/${termId}`);
  return response.data;
};

export const getInstructorAssignmentsByInstructorId = async (instructorId: number): Promise<InstructorAssignment[]> => {
  const response = await apiClient.get<InstructorAssignment[]>(`/instructor-assignments/instructor/${instructorId}`);
  return response.data;
};

export const getAllInstructorAssignments = async (): Promise<InstructorAssignment[]> => {
  const response = await apiClient.get<InstructorAssignment[]>('/instructor-assignments');
  return response.data;
};

export const getInstructorSchedule = async (instructorId: number, yearMonth?: string): Promise<InstructorAssignment[]> => {
  const response = await apiClient.get<InstructorAssignment[]>(`/instructor-assignments/schedule/${instructorId}`, {
    params: yearMonth ? { yearMonth } : {}
  });
  return response.data;
};

export const cancelInstructorAssignment = async (id: number): Promise<void> => {
  await apiClient.delete(`/instructor-assignments/${id}`);
};
