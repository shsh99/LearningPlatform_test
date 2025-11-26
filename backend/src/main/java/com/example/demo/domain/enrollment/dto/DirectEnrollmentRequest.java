package com.example.demo.domain.enrollment.dto;

import jakarta.validation.constraints.NotNull;

/**
 * 관리자의 직접 수강 신청 요청 DTO
 */
public record DirectEnrollmentRequest(
    @NotNull(message = "학생 ID는 필수입니다")
    Long userId,

    @NotNull(message = "차수 ID는 필수입니다")
    Long termId
) {
}
