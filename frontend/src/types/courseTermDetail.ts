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
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
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
