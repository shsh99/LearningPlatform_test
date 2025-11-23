/**
 * Course 관련 타입 정의
 */

export type CourseStatus = 'APPROVED' | 'REJECTED' | 'PENDING';

export interface Course {
  id: number;
  title: string;
  description: string;
  maxStudents: number;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  maxStudents: number;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  maxStudents?: number;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  maxStudents: number;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}
