package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.Schedule;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * 수강생 시간표 응답 DTO
 */
public record StudentScheduleResponse(
    Long termId,
    String courseName,
    Integer termNumber,
    LocalDate termStartDate,
    LocalDate termEndDate,
    List<ScheduleItem> schedules
) {
    public record ScheduleItem(
        Long scheduleId,
        Integer weekNumber,
        String dayOfWeek,
        LocalDate scheduleDate,
        LocalTime startTime,
        LocalTime endTime,
        String scheduleType,
        String classRoomName,
        String classRoomLocation,
        String note
    ) {
        public static ScheduleItem from(Schedule schedule) {
            return new ScheduleItem(
                schedule.getId(),
                schedule.getWeekNumber(),
                schedule.getDayOfWeek().name(),
                schedule.getScheduleDate(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getScheduleType().name(),
                schedule.getClassRoom() != null ? schedule.getClassRoom().getName() : null,
                schedule.getClassRoom() != null ? schedule.getClassRoom().getLocation() : null,
                schedule.getNote()
            );
        }
    }
}
