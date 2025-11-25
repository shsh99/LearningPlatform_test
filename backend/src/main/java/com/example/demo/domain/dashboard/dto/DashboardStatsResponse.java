package com.example.demo.domain.dashboard.dto;

import java.util.List;
import java.util.Map;

public record DashboardStatsResponse(
    // 전체 통계
    long totalUsers,
    long totalCourses,
    long totalTerms,
    long totalInstructors,

    // 차수 상태별 통계
    long scheduledTerms,
    long inProgressTerms,
    long completedTerms,
    long cancelledTerms,

    // 강의 신청 통계
    long pendingApplications,
    long approvedApplications,
    long rejectedApplications,

    // 사용자 역할별 통계
    Map<String, Long> usersByRole,

    // 최근 차수 목록 (캘린더용)
    List<TermCalendarItem> upcomingTerms,

    // 강사별 배정 현황
    List<InstructorStats> instructorStats
) {
    public record TermCalendarItem(
        Long id,
        String courseTitle,
        Integer termNumber,
        String startDate,
        String endDate,
        List<String> daysOfWeek,
        String startTime,
        String endTime,
        String status,
        Integer currentStudents,
        Integer maxStudents,
        String instructorName
    ) {}

    public record InstructorStats(
        Long instructorId,
        String instructorName,
        long assignedTerms,
        long inProgressTerms,
        long completedTerms
    ) {}
}
