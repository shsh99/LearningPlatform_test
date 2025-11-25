export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

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
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
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
}

export interface UpdateCourseTermRequest {
  startDate: string;
  endDate: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  maxStudents: number;
}
