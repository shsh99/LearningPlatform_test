package com.example.demo.domain.timeschedule.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateClassRoomRequest(
        @NotBlank(message = "강의실 이름은 필수입니다")
        String name,

        String location,

        @NotNull(message = "수용 인원은 필수입니다")
        @Min(value = 1, message = "수용 인원은 1명 이상이어야 합니다")
        Integer capacity,

        String facilities
) {
}
