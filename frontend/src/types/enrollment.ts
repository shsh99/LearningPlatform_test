/**
 * Enrollment 관련 타입 정의
 */

export type EnrollmentStatus = 'ENROLLED' | 'CANCELLED' | 'COMPLETED';

export interface Enrollment {
  id: number;
  termId: number;
  courseName: string;
  termNumber: number;
  studentId: number;
  studentName: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentRequest {
  termId: number;
  studentId: number;
}

export interface EnrollmentResponse {
  id: number;
  termId: number;
  courseName: string;
  termNumber: number;
  studentId: number;
  studentName: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DirectEnrollmentRequest {
  userId: number;
  termId: number;
}
