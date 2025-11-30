package com.example.demo.domain.tenant.dto;

import com.example.demo.domain.tenant.entity.TenantSettings;

public record TenantSettingsResponse(
        Long tenantId,
        Boolean courseEnabled,
        Boolean enrollmentEnabled,
        Boolean applicationEnabled,
        Boolean dashboardEnabled,
        Boolean instructorManagementEnabled,
        Boolean studentManagementEnabled,
        Boolean reportEnabled,
        Boolean notificationEnabled,
        String menuVisibility,
        String componentOrder,
        Integer maxUsersLimit,
        Integer maxCoursesLimit,
        Integer sessionTimeoutMinutes,
        String defaultLanguage,
        String timezone
) {
    public static TenantSettingsResponse from(TenantSettings settings) {
        if (settings == null) {
            return null;
        }
        return new TenantSettingsResponse(
                settings.getTenantId(),
                settings.getCourseEnabled(),
                settings.getEnrollmentEnabled(),
                settings.getApplicationEnabled(),
                settings.getDashboardEnabled(),
                settings.getInstructorManagementEnabled(),
                settings.getStudentManagementEnabled(),
                settings.getReportEnabled(),
                settings.getNotificationEnabled(),
                settings.getMenuVisibility(),
                settings.getComponentOrder(),
                settings.getMaxUsersLimit(),
                settings.getMaxCoursesLimit(),
                settings.getSessionTimeoutMinutes(),
                settings.getDefaultLanguage(),
                settings.getTimezone()
        );
    }
}
