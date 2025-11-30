package com.example.demo.domain.tenant.dto;

import jakarta.validation.constraints.Size;

public record UpdateTenantRequest(
        @Size(min = 2, max = 100, message = "테넌트 이름은 2~100자 사이여야 합니다")
        String name,

        @Size(max = 255, message = "도메인은 255자 이하여야 합니다")
        String domain
) {
}
