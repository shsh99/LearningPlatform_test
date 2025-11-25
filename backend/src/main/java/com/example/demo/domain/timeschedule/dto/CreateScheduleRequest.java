package com.example.demo.domain.timeschedule.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateScheduleRequest(
        @NotNull(message = "기수 ID는 필수입니다")
        Long termId,

        Long classRoomId,

        @NotNull(message = "주차는 필수입니다")
        Integer weekNumber,

        @NotNull(message = "요일은 필수입니다")
        String dayOfWeek,

        @NotNull(message = "일정 날짜는 필수입니다")
        LocalDate scheduleDate,

        @NotNull(message = "시작 시간은 필수입니다")
        LocalTime startTime,

        @NotNull(message = "종료 시간은 필수입니다")
        LocalTime endTime,

        String note
) {
}
