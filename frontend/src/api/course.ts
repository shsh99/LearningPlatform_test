import { apiClient } from './client';
import type { Course, CreateCourseRequest, UpdateCourseRequest, CourseStatus } from '../types/course';

/**
 * Course API 클라이언트
 */

// 강의 생성
export const createCourse = async (data: CreateCourseRequest): Promise<Course> => {
  const response = await apiClient.post<Course>('/courses', data);
  return response.data;
};

// 강의 단건 조회
export const getCourseById = async (id: number): Promise<Course> => {
  const response = await apiClient.get<Course>(`/courses/${id}`);
  return response.data;
};

// 전체 강의 목록 조회
export const getAllCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get<Course[]>('/courses');
  return response.data;
};

// 상태별 강의 조회
export const getCoursesByStatus = async (status: CourseStatus): Promise<Course[]> => {
  const response = await apiClient.get<Course[]>(`/courses/status/${status}`);
  return response.data;
};

// 강의 제목으로 검색
export const searchCourses = async (keyword: string): Promise<Course[]> => {
  const response = await apiClient.get<Course[]>('/courses/search', {
    params: { keyword },
  });
  return response.data;
};

// 강의 수정
export const updateCourse = async (id: number, data: UpdateCourseRequest): Promise<Course> => {
  const response = await apiClient.patch<Course>(`/courses/${id}`, data);
  return response.data;
};

// 강의 삭제
export const deleteCourse = async (id: number): Promise<void> => {
  await apiClient.delete(`/courses/${id}`);
};

// 강의 승인
export const approveCourse = async (id: number): Promise<Course> => {
  const response = await apiClient.post<Course>(`/courses/${id}/approve`);
  return response.data;
};

// 강의 거부
export const rejectCourse = async (id: number): Promise<Course> => {
  const response = await apiClient.post<Course>(`/courses/${id}/reject`);
  return response.data;
};
