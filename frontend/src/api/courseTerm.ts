import { apiClient } from './client';
import type { CourseTerm, CreateCourseTermRequest, UpdateCourseTermRequest } from '../types/courseTerm';

export const createCourseTerm = async (request: CreateCourseTermRequest): Promise<CourseTerm> => {
  const response = await apiClient.post<CourseTerm>('/course-terms', request);
  return response.data;
};

export const updateCourseTerm = async (id: number, request: UpdateCourseTermRequest): Promise<CourseTerm> => {
  const response = await apiClient.patch<CourseTerm>(`/course-terms/${id}`, request);
  return response.data;
};

export const getCourseTermById = async (id: number): Promise<CourseTerm> => {
  const response = await apiClient.get<CourseTerm>(`/course-terms/${id}`);
  return response.data;
};

export const getCourseTermsByCourseId = async (courseId: number): Promise<CourseTerm[]> => {
  const response = await apiClient.get<CourseTerm[]>(`/course-terms/course/${courseId}`);
  return response.data;
};

export const getAllCourseTerms = async (): Promise<CourseTerm[]> => {
  const response = await apiClient.get<CourseTerm[]>('/course-terms');
  return response.data;
};

export const searchCourseTermsByDateRange = async (startDate: string, endDate: string): Promise<CourseTerm[]> => {
  const response = await apiClient.get<CourseTerm[]>('/course-terms/search', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const duplicateCourseTerm = async (id: number, newStartDate: string, newEndDate: string): Promise<CourseTerm> => {
  const response = await apiClient.post<CourseTerm>(`/course-terms/${id}/duplicate`, null, {
    params: { newStartDate, newEndDate }
  });
  return response.data;
};

export const startCourseTerm = async (id: number): Promise<void> => {
  await apiClient.patch(`/course-terms/${id}/start`);
};

export const completeCourseTerm = async (id: number): Promise<void> => {
  await apiClient.patch(`/course-terms/${id}/complete`);
};

export const cancelCourseTerm = async (id: number): Promise<void> => {
  await apiClient.patch(`/course-terms/${id}/cancel`);
};
