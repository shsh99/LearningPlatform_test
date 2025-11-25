import { apiClient } from './client';
import type { StudentScheduleResponse, DateRangeParams } from '../types/studentSchedule';

const BASE_URL = '/students';

/**
 * 수강생의 모든 활성 수강 시간표 조회
 */
export const getStudentSchedules = async (studentId: number): Promise<StudentScheduleResponse[]> => {
  const response = await apiClient.get(`${BASE_URL}/${studentId}/schedules`);
  return response.data;
};

/**
 * 수강생의 특정 기간 시간표 조회
 */
export const getStudentSchedulesByDateRange = async (
  studentId: number,
  params: DateRangeParams
): Promise<StudentScheduleResponse[]> => {
  const response = await apiClient.get(`${BASE_URL}/${studentId}/schedules/range`, {
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });
  return response.data;
};

/**
 * 수강생의 특정 차수 시간표 조회
 */
export const getStudentScheduleByTerm = async (
  studentId: number,
  termId: number
): Promise<StudentScheduleResponse> => {
  const response = await apiClient.get(`${BASE_URL}/${studentId}/schedules/terms/${termId}`);
  return response.data;
};
