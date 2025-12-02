export interface StudentInformationSystem {
  id: number;
  userKey: number;
  timeKey: number;
  timestamp: string;
  enrollmentId: number;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  termNumber: number;
  enrollmentStatus: 'ENROLLED' | 'CANCELLED' | 'COMPLETED';
  enrollmentCreatedAt: string;
  progressPercentage: number;
}

export interface StudentInformationSystemQuery {
  userKey?: number;
  timeKey?: number;
}

// 페이지네이션 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 현재 페이지 (0-based)
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SISPageResponse extends PageResponse<StudentInformationSystem> {}
