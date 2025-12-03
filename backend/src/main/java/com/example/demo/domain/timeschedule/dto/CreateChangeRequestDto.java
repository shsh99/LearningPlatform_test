package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

/**
 * 차수 변경 요청 생성 DTO
 */
public record CreateChangeRequestDto(
        @NotNull(message = "차수 ID는 필수입니다")
        Long courseTermId,

        @NotNull(message = "시작일은 필수입니다")
        LocalDate startDate,

        @NotNull(message = "종료일은 필수입니다")
        LocalDate endDate,

        @NotEmpty(message = "요일은 최소 1개 이상 선택해야 합니다")
        Set<DayOfWeek> daysOfWeek,

        @NotNull(message = "시작 시간은 필수입니다")
        LocalTime startTime,

        @NotNull(message = "종료 시간은 필수입니다")
        LocalTime endTime,

        @NotNull(message = "최대 수강 인원은 필수입니다")
        @Positive(message = "최대 수강 인원은 양수여야 합니다")
        Integer maxStudents,

        @Size(max = 500, message = "변경 사유는 500자 이내로 입력해주세요")
        String reason
) {}
