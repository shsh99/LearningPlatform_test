/**
 * 수강생 시간표 관련 타입
 */

export interface ScheduleItem {
  scheduleId: number;
  weekNumber: number;
  dayOfWeek: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  scheduleType: string;
  classRoomName: string | null;
  classRoomLocation: string | null;
  note: string | null;
}

export interface StudentScheduleResponse {
  termId: number;
  courseName: string;
  termNumber: number;
  termStartDate: string;
  termEndDate: string;
  schedules: ScheduleItem[];
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}
