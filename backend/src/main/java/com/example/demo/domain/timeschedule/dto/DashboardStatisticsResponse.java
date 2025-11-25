package com.example.demo.domain.timeschedule.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * 대시보드 통계 응답 DTO
 */
public record DashboardStatisticsResponse(
    // 전체 현황
    OverallStatistics overall,
    // 오늘의 일정
    TodaySchedules todaySchedules,
    // 이번 주 일정
    WeeklyScheduleSummary weeklySchedules,
    // 차수별 현황
    List<TermStatistics> termStatistics
) {
    public record OverallStatistics(
        Long totalCourses,
        Long totalTerms,
        Long activeTerms,
        Long totalStudents,
        Long totalInstructors,
        Long totalClassRooms,
        Long availableClassRooms
    ) {}

    public record TodaySchedules(
        LocalDate date,
        Integer totalClasses,
        Integer cancelledClasses,
        Integer makeupClasses,
        List<ScheduleSummary> schedules
    ) {}

    public record ScheduleSummary(
        Long scheduleId,
        String courseName,
        Integer termNumber,
        String startTime,
        String endTime,
        String classRoomName,
        String instructorName,
        String scheduleType
    ) {}

    public record WeeklyScheduleSummary(
        LocalDate weekStart,
        LocalDate weekEnd,
        Integer mondayCount,
        Integer tuesdayCount,
        Integer wednesdayCount,
        Integer thursdayCount,
        Integer fridayCount,
        Integer saturdayCount,
        Integer sundayCount,
        Integer totalCount
    ) {}

    public record TermStatistics(
        Long termId,
        String courseName,
        Integer termNumber,
        String status,
        LocalDate startDate,
        LocalDate endDate,
        Integer currentStudents,
        Integer maxStudents,
        Integer totalSchedules,
        Integer completedSchedules,
        Integer remainingSchedules,
        Double progressPercent
    ) {}
}
