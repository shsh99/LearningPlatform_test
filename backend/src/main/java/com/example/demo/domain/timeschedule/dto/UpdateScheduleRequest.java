package com.example.demo.domain.timeschedule.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record UpdateScheduleRequest(
        Long classRoomId,
        String dayOfWeek,
        LocalDate scheduleDate,
        LocalTime startTime,
        LocalTime endTime,
        String scheduleType,
        String note
) {
}
