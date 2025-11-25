package com.example.demo.domain.timeschedule.dto;

import jakarta.validation.constraints.Min;

public record UpdateClassRoomRequest(
        String name,
        String location,

        @Min(value = 1, message = "수용 인원은 1명 이상이어야 합니다")
        Integer capacity,

        String facilities,
        String status
) {
}
