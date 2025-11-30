package com.example.demo.domain.tenantapplication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 테넌트 신청 승인 요청 DTO
 * 승인 시 테넌트 어드민의 초기 비밀번호를 설정합니다.
 */
public record ApproveApplicationRequest(
        @NotBlank(message = "초기 비밀번호는 필수입니다")
        @Size(min = 8, max = 20, message = "비밀번호는 8~20자여야 합니다")
        String initialPassword
) {
}
