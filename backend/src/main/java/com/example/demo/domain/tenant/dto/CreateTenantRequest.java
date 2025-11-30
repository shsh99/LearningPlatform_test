package com.example.demo.domain.tenant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateTenantRequest(
        @NotBlank(message = "테넌트 코드는 필수입니다")
        @Size(min = 2, max = 50, message = "테넌트 코드는 2~50자 사이여야 합니다")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "테넌트 코드는 소문자, 숫자, 하이픈만 사용할 수 있습니다")
        String code,

        @NotBlank(message = "테넌트 이름은 필수입니다")
        @Size(min = 2, max = 100, message = "테넌트 이름은 2~100자 사이여야 합니다")
        String name,

        @Size(max = 255, message = "도메인은 255자 이하여야 합니다")
        String domain
) {
}
