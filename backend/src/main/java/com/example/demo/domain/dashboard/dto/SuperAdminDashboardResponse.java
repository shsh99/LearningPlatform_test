package com.example.demo.domain.dashboard.dto;

import java.util.List;
import java.util.Map;

/**
 * SuperAdmin 대시보드 응답 DTO
 */
public record SuperAdminDashboardResponse(
        // 전체 통계
        TotalStats totalStats,
        // 테넌트별 통계 목록
        List<TenantStats> tenantStatsList
) {
    /**
     * 전체 통계
     */
    public record TotalStats(
            long totalTenants,
            long totalUsers,
            long totalCourses,
            double averageRating,
            long totalUsageMinutes
    ) {}

    /**
     * 테넌트별 통계
     */
    public record TenantStats(
            Long tenantId,
            String tenantCode,
            String tenantName,
            String status,
            long userCount,
            long courseCount,
            long termCount,
            double averageRating,
            long usageMinutes
    ) {}
}
