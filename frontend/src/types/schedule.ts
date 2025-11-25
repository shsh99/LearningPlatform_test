export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type ScheduleType = 'REGULAR' | 'MAKEUP' | 'CANCELLED';

export interface Schedule {
    id: number;
    termId: number;
    courseName: string;
    termNumber: number;
    classRoomId: number | null;
    classRoomName: string | null;
    weekNumber: number;
    dayOfWeek: DayOfWeek;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    scheduleType: ScheduleType;
    note: string | null;
}

export interface CreateScheduleRequest {
    termId: number;
    classRoomId?: number;
    weekNumber: number;
    dayOfWeek: DayOfWeek;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    note?: string;
}

export interface UpdateScheduleRequest {
    classRoomId?: number;
    dayOfWeek?: DayOfWeek;
    scheduleDate?: string;
    startTime?: string;
    endTime?: string;
    scheduleType?: ScheduleType;
    note?: string;
}
