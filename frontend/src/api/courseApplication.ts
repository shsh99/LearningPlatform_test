import { apiClient } from './client';
import type {
  CourseApplication,
  CreateCourseApplicationRequest,
  RejectCourseApplicationRequest,
  ApplicationStatus,
} from '../types/courseApplication';

/**
 * CourseApplication API 클라이언트
 */

// 강의 개설 신청 생성
export const createCourseApplication = async (
  request: CreateCourseApplicationRequest
): Promise<CourseApplication> => {
  const response = await apiClient.post<CourseApplication>(
    '/course-applications',
    request
  );
  return response.data;
};

// 강의 개설 신청 단건 조회
export const getCourseApplicationById = async (
  id: number
): Promise<CourseApplication> => {
  const response = await apiClient.get<CourseApplication>(
    `/course-applications/${id}`
  );
  return response.data;
};

// 내 강의 개설 신청 목록 조회
export const getMyCourseApplications = async (): Promise<
  CourseApplication[]
> => {
  const response = await apiClient.get<CourseApplication[]>(
    '/course-applications/my'
  );
  return response.data;
};

// 내 강의 개설 신청 상태별 조회
export const getMyCourseApplicationsByStatus = async (
  status: ApplicationStatus
): Promise<CourseApplication[]> => {
  const response = await apiClient.get<CourseApplication[]>(
    `/course-applications/my/status/${status}`
  );
  return response.data;
};

// 전체 강의 개설 신청 목록 조회 (OPERATOR용)
export const getAllCourseApplications = async (): Promise<
  CourseApplication[]
> => {
  const response = await apiClient.get<CourseApplication[]>(
    '/course-applications'
  );
  return response.data;
};

// 상태별 강의 개설 신청 목록 조회 (OPERATOR용)
export const getCourseApplicationsByStatus = async (
  status: ApplicationStatus
): Promise<CourseApplication[]> => {
  const response = await apiClient.get<CourseApplication[]>(
    `/course-applications/status/${status}`
  );
  return response.data;
};

// 강의 개설 신청 승인
export const approveCourseApplication = async (
  id: number
): Promise<CourseApplication> => {
  const response = await apiClient.post<CourseApplication>(
    `/course-applications/${id}/approve`
  );
  return response.data;
};

// 강의 개설 신청 거부
export const rejectCourseApplication = async (
  id: number,
  request: RejectCourseApplicationRequest
): Promise<CourseApplication> => {
  const response = await apiClient.post<CourseApplication>(
    `/course-applications/${id}/reject`,
    request
  );
  return response.data;
};

// 강의 개설 신청 취소
export const cancelCourseApplication = async (id: number): Promise<void> => {
  await apiClient.delete(`/course-applications/${id}`);
};
