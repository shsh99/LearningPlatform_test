package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.DashboardStatisticsResponse;

/**
 * 대시보드 통계 서비스
 */
public interface DashboardService {

    /**
     * 대시보드 전체 통계 조회
     */
    DashboardStatisticsResponse getDashboardStatistics();

    /**
     * 전체 현황 통계 조회
     */
    DashboardStatisticsResponse.OverallStatistics getOverallStatistics();

    /**
     * 오늘의 일정 조회
     */
    DashboardStatisticsResponse.TodaySchedules getTodaySchedules();

    /**
     * 이번 주 일정 요약 조회
     */
    DashboardStatisticsResponse.WeeklyScheduleSummary getWeeklyScheduleSummary();
}
