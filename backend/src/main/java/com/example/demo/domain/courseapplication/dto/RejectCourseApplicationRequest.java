package com.example.demo.domain.courseapplication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 강의 개설 신청 거부 Request DTO
 */
public record RejectCourseApplicationRequest(
    @NotBlank(message = "거부 사유는 필수입니다")
    @Size(max = 500, message = "거부 사유는 500자를 초과할 수 없습니다")
    String reason
) {
}
