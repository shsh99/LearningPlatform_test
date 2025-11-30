package com.example.demo.domain.tenant.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateTenantSettingsRequest(
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

        @Min(value = 1, message = "최대 사용자 수는 1명 이상이어야 합니다")
        @Max(value = 100000, message = "최대 사용자 수는 100,000명 이하여야 합니다")
        Integer maxUsersLimit,

        @Min(value = 1, message = "최대 강의 수는 1개 이상이어야 합니다")
        @Max(value = 10000, message = "최대 강의 수는 10,000개 이하여야 합니다")
        Integer maxCoursesLimit,

        @Min(value = 5, message = "세션 타임아웃은 5분 이상이어야 합니다")
        @Max(value = 1440, message = "세션 타임아웃은 1440분(24시간) 이하여야 합니다")
        Integer sessionTimeoutMinutes,

        @Size(max = 10, message = "언어 코드는 10자 이하여야 합니다")
        String defaultLanguage,

        @Size(max = 50, message = "타임존은 50자 이하여야 합니다")
        String timezone
) {
}
