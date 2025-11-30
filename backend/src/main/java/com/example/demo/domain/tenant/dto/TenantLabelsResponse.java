package com.example.demo.domain.tenant.dto;

import com.example.demo.domain.tenant.entity.TenantLabels;

public record TenantLabelsResponse(
        Long tenantId,
        String courseLabel,
        String termLabel,
        String studentLabel,
        String instructorLabel,
        String enrollmentLabel,
        String applicationLabel,
        String dashboardLabel,
        String platformName,
        String customLabels
) {
    public static TenantLabelsResponse from(TenantLabels labels) {
        if (labels == null) {
            return null;
        }
        return new TenantLabelsResponse(
                labels.getTenantId(),
                labels.getCourseLabel(),
                labels.getTermLabel(),
                labels.getStudentLabel(),
                labels.getInstructorLabel(),
                labels.getEnrollmentLabel(),
                labels.getApplicationLabel(),
                labels.getDashboardLabel(),
                labels.getPlatformName(),
                labels.getCustomLabels()
        );
    }
}
