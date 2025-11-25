/**
 * 강사 시간표 관련 타입
 */

export interface InstructorScheduleItem {
  scheduleId: number;
  weekNumber: number;
  dayOfWeek: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  scheduleType: string;
  classRoomName: string | null;
  classRoomLocation: string | null;
  classRoomCapacity: number | null;
  note: string | null;
}

export interface InstructorScheduleResponse {
  termId: number;
  courseName: string;
  termNumber: number;
  termStartDate: string;
  termEndDate: string;
  assignmentStatus: string;
  schedules: InstructorScheduleItem[];
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}
