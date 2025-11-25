package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.Schedule;

import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleResponse(
        Long id,
        Long termId,
        String courseName,
        Integer termNumber,
        Long classRoomId,
        String classRoomName,
        Integer weekNumber,
        String dayOfWeek,
        LocalDate scheduleDate,
        LocalTime startTime,
        LocalTime endTime,
        String scheduleType,
        String note
) {
    public static ScheduleResponse from(Schedule schedule) {
        return new ScheduleResponse(
                schedule.getId(),
                schedule.getTerm().getId(),
                schedule.getTerm().getCourse().getTitle(),
                schedule.getTerm().getTermNumber(),
                schedule.getClassRoom() != null ? schedule.getClassRoom().getId() : null,
                schedule.getClassRoom() != null ? schedule.getClassRoom().getName() : null,
                schedule.getWeekNumber(),
                schedule.getDayOfWeek().name(),
                schedule.getScheduleDate(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getScheduleType().name(),
                schedule.getNote()
        );
    }
}
