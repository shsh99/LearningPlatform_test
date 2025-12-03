/**
 * 강의 기수 상세 조회 Response
 */
export interface CourseTermDetail {
  id: number;
  courseTitle: string;
  termNumber: number;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  maxStudents: number;
  currentStudents: number;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  // 모집 관리 필드
  enrollmentStartDate: string | null;
  enrollmentEndDate: string | null;
  enrollmentStartTime: string | null;
  enrollmentEndTime: string | null;
  enrollmentType: 'FIRST_COME' | 'SELECTION' | null;
  minStudents: number | null;
  instructor: AssignedInstructor | null;
  enrolledStudents: EnrolledStudent[];
  createdAt: string;
}

/**
 * 배정된 강사 정보
 */
export interface AssignedInstructor {
  assignmentId: number;
  instructorId: number;
  instructorName: string;
  instructorEmail: string;
  assignedAt: string;
}

/**
 * 수강생 정보 (이메일 마스킹 처리됨)
 */
export interface EnrolledStudent {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  studentEmail: string; // Masked: "use***@example.com"
  status: 'ENROLLED' | 'COMPLETED' | 'CANCELLED';
  enrolledAt: string;
}
