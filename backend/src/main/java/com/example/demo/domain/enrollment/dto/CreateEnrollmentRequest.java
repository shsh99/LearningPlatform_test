package com.example.demo.domain.enrollment.dto;

import jakarta.validation.constraints.NotNull;

public record CreateEnrollmentRequest(
    @NotNull(message = "차수 ID는 필수입니다")
    Long termId,

    @NotNull(message = "학생 ID는 필수입니다")
    Long studentId
) {
}
