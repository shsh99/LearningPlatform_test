package com.example.demo.domain.tenant.dto;

import jakarta.validation.constraints.Size;

public record UpdateTenantLabelsRequest(
        @Size(max = 50, message = "라벨은 50자 이하여야 합니다")
        String courseLabel,

        @Size(max = 50, message = "라벨은 50자 이하여야 합니다")
        String termLabel,

        @Size(max = 50, message = "라벨은 50자 이하여야 합니다")
        String studentLabel,

        @Size(max = 50, message = "라벨은 50자 이하여야 합니다")
        String instructorLabel,

        @Size(max = 50, message = "라벨은 50자 이하여야 합니다")
        String enrollmentLabel,

        @Size(max = 50, message = "라벨은 50자 이하여야 합니다")
        String applicationLabel,

        @Size(max = 50, message = "라벨은 50자 이하여야 합니다")
        String dashboardLabel,

        @Size(max = 100, message = "플랫폼 이름은 100자 이하여야 합니다")
        String platformName,

        String customLabels
) {
}
