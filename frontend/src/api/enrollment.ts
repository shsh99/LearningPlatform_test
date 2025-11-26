import { apiClient } from './client';
import type {
  Enrollment,
  CreateEnrollmentRequest,
  EnrollmentResponse,
} from '../types/enrollment';

/**
 * Enrollment API 클라이언트
 */

// 수강 신청
export const enrollCourse = async (
  request: CreateEnrollmentRequest
): Promise<EnrollmentResponse> => {
  const response = await apiClient.post<EnrollmentResponse>(
    '/enrollments',
    request
  );
  return response.data;
};

// 수강 신청 단건 조회
export const getEnrollmentById = async (id: number): Promise<Enrollment> => {
  const response = await apiClient.get<Enrollment>(`/enrollments/${id}`);
  return response.data;
};

// 학생별 수강 신청 목록 조회
export const getEnrollmentsByStudent = async (
  studentId: number
): Promise<Enrollment[]> => {
  const response = await apiClient.get<Enrollment[]>(
    `/enrollments/student/${studentId}`
  );
  return response.data;
};

// 학기별 수강 신청 목록 조회
export const getEnrollmentsByTerm = async (
  termId: number
): Promise<Enrollment[]> => {
  const response = await apiClient.get<Enrollment[]>(
    `/enrollments/term/${termId}`
  );
  return response.data;
};

// 학생별 상태별 수강 신청 목록 조회
export const getEnrollmentsByStudentAndStatus = async (
  studentId: number,
  status: string
): Promise<Enrollment[]> => {
  const response = await apiClient.get<Enrollment[]>(
    `/enrollments/student/${studentId}/status/${status}`
  );
  return response.data;
};

// 차수별 상태별 수강 신청 목록 조회
export const getEnrollmentsByTermAndStatus = async (
  termId: number,
  status: string
): Promise<EnrollmentResponse[]> => {
  const response = await apiClient.get<EnrollmentResponse[]>(
    `/enrollments/term/${termId}/status/${status}`
  );
  return response.data;
};

// 차수별 ENROLLED 학생 목록 조회 (편의 함수)
export const getEnrolledStudentsByTerm = async (
  termId: number
): Promise<EnrollmentResponse[]> => {
  return getEnrollmentsByTermAndStatus(termId, 'ENROLLED');
};

// 수강 취소
export const cancelEnrollment = async (id: number): Promise<void> => {
  await apiClient.delete(`/enrollments/${id}`);
};

// 수강 완료
export const completeEnrollment = async (
  id: number
): Promise<EnrollmentResponse> => {
  const response = await apiClient.post<EnrollmentResponse>(
    `/enrollments/${id}/complete`
  );
  return response.data;
};
