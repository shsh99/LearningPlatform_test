/**
 * 강의 개설 신청 상태
 */
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * 강의 개설 신청
 */
export interface CourseApplication {
  id: number;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  title: string;
  description: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 강의 개설 신청 생성 Request
 */
export interface CreateCourseApplicationRequest {
  title: string;
  description: string;
}

/**
 * 강의 개설 신청 거부 Request
 */
export interface RejectCourseApplicationRequest {
  reason: string;
}
