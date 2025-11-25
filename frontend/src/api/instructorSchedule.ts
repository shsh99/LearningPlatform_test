import { apiClient } from './client';
import type { InstructorScheduleResponse, InstructorScheduleItem, DateRangeParams } from '../types/instructorSchedule';

const BASE_URL = '/instructors';

/**
 * 강사의 모든 배정된 시간표 조회
 */
export const getInstructorSchedules = async (instructorId: number): Promise<InstructorScheduleResponse[]> => {
  const response = await apiClient.get(`${BASE_URL}/${instructorId}/schedules`);
  return response.data;
};

/**
 * 강사의 특정 기간 시간표 조회
 */
export const getInstructorSchedulesByDateRange = async (
  instructorId: number,
  params: DateRangeParams
): Promise<InstructorScheduleResponse[]> => {
  const response = await apiClient.get(`${BASE_URL}/${instructorId}/schedules/range`, {
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });
  return response.data;
};

/**
 * 강사의 특정 차수 시간표 조회
 */
export const getInstructorScheduleByTerm = async (
  instructorId: number,
  termId: number
): Promise<InstructorScheduleResponse> => {
  const response = await apiClient.get(`${BASE_URL}/${instructorId}/schedules/terms/${termId}`);
  return response.data;
};

/**
 * 강사의 오늘 시간표 조회
 */
export const getInstructorTodaySchedules = async (instructorId: number): Promise<InstructorScheduleItem[]> => {
  const response = await apiClient.get(`${BASE_URL}/${instructorId}/schedules/today`);
  return response.data;
};
