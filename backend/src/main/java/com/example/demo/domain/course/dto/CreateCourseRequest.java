package com.example.demo.domain.course.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 강의 생성 요청 DTO
 */
public record CreateCourseRequest(
    @NotBlank(message = "강의 제목은 필수입니다")
    @Size(max = 200, message = "강의 제목은 200자 이하여야 합니다")
    String title,

    @Size(max = 5000, message = "강의 설명은 5000자 이하여야 합니다")
    String description,

    @NotNull(message = "최대 수강 인원은 필수입니다")
    @Min(value = 1, message = "최대 수강 인원은 1명 이상이어야 합니다")
    Integer maxStudents
) {
    /**
     * Compact constructor - 데이터 정규화
     */
    public CreateCourseRequest {
        if (title != null) {
            title = title.trim();
        }
        if (description != null) {
            description = description.trim();
        }
    }
}
