package com.example.demo.domain.tenantapplication.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 테넌트 신청 생성 요청 DTO (비회원용)
 */
public record CreateTenantApplicationRequest(
        @NotBlank(message = "회사명은 필수입니다")
        @Size(min = 2, max = 100, message = "회사명은 2~100자여야 합니다")
        String companyName,

        @NotBlank(message = "회사 코드는 필수입니다")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "회사 코드는 영소문자, 숫자, 하이픈만 사용 가능합니다")
        @Size(min = 3, max = 50, message = "회사 코드는 3~50자여야 합니다")
        String companyCode,

        @NotBlank(message = "담당자명은 필수입니다")
        @Size(min = 2, max = 50, message = "담당자명은 2~50자여야 합니다")
        String adminName,

        @NotBlank(message = "담당자 이메일은 필수입니다")
        @Email(message = "올바른 이메일 형식이 아닙니다")
        @Size(max = 100, message = "이메일은 100자 이하여야 합니다")
        String adminEmail,

        @Size(max = 20, message = "연락처는 20자 이하여야 합니다")
        String phoneNumber,

        @Size(max = 20, message = "사업자등록번호는 20자 이하여야 합니다")
        String businessNumber,

        @Size(max = 1000, message = "신청 사유는 1000자 이하여야 합니다")
        String description
) {
}
