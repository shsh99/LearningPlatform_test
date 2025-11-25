package com.example.demo.domain.timeschedule.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record CreateCourseTermRequest(
    @NotNull(message = "강의 ID는 필수입니다")
    Long courseId,

    @NotNull(message = "차수 번호는 필수입니다")
    @Min(value = 1, message = "차수 번호는 1 이상이어야 합니다")
    Integer termNumber,

    @NotNull(message = "시작일은 필수입니다")
    @FutureOrPresent(message = "시작일은 오늘 이후 날짜여야 합니다")
    LocalDate startDate,

    @NotNull(message = "종료일은 필수입니다")
    LocalDate endDate,

    @NotNull(message = "최대 학생 수는 필수입니다")
    @Min(value = 1, message = "최대 학생 수는 1명 이상이어야 합니다")
    @Max(value = 1000, message = "최대 학생 수는 1000명 이하여야 합니다")
    Integer maxStudents,

    // 자동 스케줄 생성을 위한 선택 필드
    @Valid
    List<WeeklyScheduleInfo> weeklySchedules
) {
    /**
     * 주간 스케줄 정보 (요일, 시작시간, 종료시간)
     */
    public record WeeklyScheduleInfo(
        @NotNull(message = "요일은 필수입니다")
        String dayOfWeek,

        @NotNull(message = "시작 시간은 필수입니다")
        LocalTime startTime,

        @NotNull(message = "종료 시간은 필수입니다")
        LocalTime endTime
    ) {}
}
