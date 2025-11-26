export interface TermCalendarItem {
  id: number;
  courseTitle: string;
  termNumber: number;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  status: string;
  currentStudents: number;
  maxStudents: number;
  instructorName: string | null;
}

export interface InstructorStats {
  instructorId: number;
  instructorName: string;
  assignedTerms: number;
  inProgressTerms: number;
  completedTerms: number;
}

export interface DashboardStats {
  // 전체 통계
  totalUsers: number;
  totalCourses: number;
  totalTerms: number;
  totalInstructors: number;

  // 차수 상태별 통계
  scheduledTerms: number;
  inProgressTerms: number;
  completedTerms: number;
  cancelledTerms: number;

  // 강의 신청 통계
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;

  // 사용자 역할별 통계
  usersByRole: Record<string, number>;

  // 캘린더용 차수 목록
  upcomingTerms: TermCalendarItem[];

  // 강사별 배정 현황
  instructorStats: InstructorStats[];
}
