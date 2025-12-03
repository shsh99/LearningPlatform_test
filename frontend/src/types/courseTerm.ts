export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type EnrollmentType = 'FIRST_COME' | 'SELECTION';

export interface CourseTerm {
  id: number;
  courseId: number;
  courseTitle: string;
  termNumber: number;
  startDate: string;
  endDate: string;
  daysOfWeek: DayOfWeek[];
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
  enrollmentType: EnrollmentType | null;
  minStudents: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseTermRequest {
  courseId: number;
  termNumber: number;
  startDate: string;
  endDate: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  maxStudents: number;
  // 모집 관리 필드 (선택)
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  enrollmentStartTime?: string;
  enrollmentEndTime?: string;
  enrollmentType?: EnrollmentType;
  minStudents?: number;
}

export interface UpdateCourseTermRequest {
  startDate: string;
  endDate: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  maxStudents: number;
  // 모집 관리 필드 (선택)
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  enrollmentStartTime?: string;
  enrollmentEndTime?: string;
  enrollmentType?: EnrollmentType;
  minStudents?: number;
}
