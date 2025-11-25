/**
 * 대시보드 통계 관련 타입
 */

export interface OverallStatistics {
  totalCourses: number;
  totalTerms: number;
  activeTerms: number;
  totalStudents: number;
  totalInstructors: number;
  totalClassRooms: number;
  availableClassRooms: number;
}

export interface ScheduleSummary {
  scheduleId: number;
  courseName: string;
  termNumber: number;
  startTime: string;
  endTime: string;
  classRoomName: string | null;
  instructorName: string | null;
  scheduleType: string;
}

export interface TodaySchedules {
  date: string;
  totalClasses: number;
  cancelledClasses: number;
  makeupClasses: number;
  schedules: ScheduleSummary[];
}

export interface WeeklyScheduleSummary {
  weekStart: string;
  weekEnd: string;
  mondayCount: number;
  tuesdayCount: number;
  wednesdayCount: number;
  thursdayCount: number;
  fridayCount: number;
  saturdayCount: number;
  sundayCount: number;
  totalCount: number;
}

export interface TermStatistics {
  termId: number;
  courseName: string;
  termNumber: number;
  status: string;
  startDate: string;
  endDate: string;
  currentStudents: number;
  maxStudents: number;
  totalSchedules: number;
  completedSchedules: number;
  remainingSchedules: number;
  progressPercent: number;
}

export interface DashboardStatisticsResponse {
  overall: OverallStatistics;
  todaySchedules: TodaySchedules;
  weeklySchedules: WeeklyScheduleSummary;
  termStatistics: TermStatistics[];
}
