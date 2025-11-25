package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

public record UpdateCourseTermRequest(
    @NotNull(message = "시작일은 필수입니다")
    LocalDate startDate,

    @NotNull(message = "종료일은 필수입니다")
    LocalDate endDate,

    @NotNull(message = "요일은 필수입니다")
    @NotEmpty(message = "최소 하나의 요일을 선택해야 합니다")
    Set<DayOfWeek> daysOfWeek,

    @NotNull(message = "시작 시간은 필수입니다")
    LocalTime startTime,

    @NotNull(message = "종료 시간은 필수입니다")
    LocalTime endTime,

    @NotNull(message = "최대 학생 수는 필수입니다")
    @Min(value = 1, message = "최대 학생 수는 1명 이상이어야 합니다")
    @Max(value = 1000, message = "최대 학생 수는 1000명 이하여야 합니다")
    Integer maxStudents
) {
}
