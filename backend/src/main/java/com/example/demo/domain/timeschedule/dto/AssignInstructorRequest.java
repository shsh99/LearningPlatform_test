package com.example.demo.domain.timeschedule.dto;

import jakarta.validation.constraints.NotNull;

public record AssignInstructorRequest(
    @NotNull(message = "차수 ID는 필수입니다")
    Long termId,

    @NotNull(message = "강사 ID는 필수입니다")
    Long instructorId,

    @NotNull(message = "배정자 ID는 필수입니다")
    Long assignedById
) {
}
