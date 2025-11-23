package com.example.demo.domain.courseapplication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 강의 개설 신청 생성 Request DTO
 */
public record CreateCourseApplicationRequest(
    @NotBlank(message = "강의 제목은 필수입니다")
    @Size(max = 200, message = "강의 제목은 200자를 초과할 수 없습니다")
    String title,

    @NotBlank(message = "강의 설명은 필수입니다")
    @Size(max = 2000, message = "강의 설명은 2000자를 초과할 수 없습니다")
    String description
) {
}
