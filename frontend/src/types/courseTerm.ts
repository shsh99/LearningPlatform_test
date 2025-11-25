export interface CourseTerm {
  id: number;
  courseId: number;
  courseTitle: string;
  termNumber: number;
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentStudents: number;
  status: 'SCHEDULED' | 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface WeeklyScheduleInfo {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface CreateCourseTermRequest {
  courseId: number;
  termNumber: number;
  startDate: string;
  endDate: string;
  maxStudents: number;
  weeklySchedules?: WeeklyScheduleInfo[];
}
