package com.example.demo.domain.tenantapplication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 테넌트 신청 거절 요청 DTO
 */
public record RejectApplicationRequest(
        @NotBlank(message = "거절 사유는 필수입니다")
        @Size(min = 10, max = 500, message = "거절 사유는 10~500자여야 합니다")
        String rejectionReason
) {
}
