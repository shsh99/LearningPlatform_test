import type { DayOfWeek } from './courseTerm';

/**
 * 차수 요청 상태
 */
export type TermRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

/**
 * 차수 요청 유형
 */
export type TermRequestType = 'CHANGE' | 'DELETE';

/**
 * 변경 요청 생성 DTO
 */
export interface CreateChangeRequestDto {
  courseTermId: number;
  startDate: string;
  endDate: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  maxStudents: number;
  reason?: string;
}

/**
 * 삭제 요청 생성 DTO
 */
export interface CreateDeleteRequestDto {
  courseTermId: number;
  reason: string;
}

/**
 * 반려 요청 DTO
 */
export interface RejectRequestDto {
  rejectionReason?: string;
}

/**
 * 변경 요청 응답
 */
export interface ChangeRequestResponse {
  id: number;
  courseTermId: number;
  courseName: string;
  termNumber: number;
  requesterId: number;
  requesterName: string;
  status: TermRequestStatus;

  // Before 스냅샷
  beforeStartDate: string;
  beforeEndDate: string;
  beforeDaysOfWeek: DayOfWeek[];
  beforeStartTime: string;
  beforeEndTime: string;
  beforeMaxStudents: number;

  // After 스냅샷
  afterStartDate: string;
  afterEndDate: string;
  afterDaysOfWeek: DayOfWeek[];
  afterStartTime: string;
  afterEndTime: string;
  afterMaxStudents: number;

  // 메타 정보
  reason?: string;
  affectedStudentCount?: number;
  rejectionReason?: string;
  processedById?: number;
  processedByName?: string;
  processedAt?: string;
  createdAt: string;
}

/**
 * 삭제 요청 응답
 */
export interface DeleteRequestResponse {
  id: number;
  courseTermId: number;
  courseName: string;
  termNumber: number;
  requesterId: number;
  requesterName: string;
  status: TermRequestStatus;
  reason: string;
  rejectionReason?: string;
  processedById?: number;
  processedByName?: string;
  processedAt?: string;
  createdAt: string;
}

/**
 * 요청 목록 응답 (변경+삭제 통합)
 */
export interface TermRequestListResponse {
  id: number;
  type: TermRequestType;
  courseTermId: number;
  courseName: string;
  termNumber: number;
  requesterId: number;
  requesterName: string;
  status: TermRequestStatus;
  reason?: string;
  createdAt: string;
}
