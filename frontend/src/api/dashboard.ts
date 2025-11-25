import { apiClient } from './client';
import type {
  DashboardStatisticsResponse,
  OverallStatistics,
  TodaySchedules,
  WeeklyScheduleSummary,
} from '../types/dashboard';

const BASE_URL = '/dashboard';

/**
 * 대시보드 전체 통계 조회
 */
export const getDashboardStatistics = async (): Promise<DashboardStatisticsResponse> => {
  const response = await apiClient.get(BASE_URL);
  return response.data;
};

/**
 * 전체 현황 통계 조회
 */
export const getOverallStatistics = async (): Promise<OverallStatistics> => {
  const response = await apiClient.get(`${BASE_URL}/overall`);
  return response.data;
};

/**
 * 오늘의 일정 조회
 */
export const getTodaySchedules = async (): Promise<TodaySchedules> => {
  const response = await apiClient.get(`${BASE_URL}/today`);
  return response.data;
};

/**
 * 이번 주 일정 요약 조회
 */
export const getWeeklyScheduleSummary = async (): Promise<WeeklyScheduleSummary> => {
  const response = await apiClient.get(`${BASE_URL}/weekly`);
  return response.data;
};
