package com.example.demo.domain.dashboard.dto;

/**
 * TenantAdmin 대시보드 응답 DTO
 */
public record TenantAdminDashboardResponse(
        // 테넌트 정보
        TenantInfo tenantInfo,
        // 통계
        Stats stats
) {
    /**
     * 테넌트 기본 정보
     */
    public record TenantInfo(
            Long tenantId,
            String tenantCode,
            String tenantName,
            String status
    ) {}

    /**
     * 통계 정보
     */
    public record Stats(
            long userCount,
            long courseCount,
            long termCount,
            long operatorCount,
            double averageRating,
            long usageMinutes
    ) {}
}
