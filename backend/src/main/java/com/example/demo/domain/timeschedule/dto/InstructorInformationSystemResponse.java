package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.InstructorInformationSystem;

import java.time.LocalDateTime;

public record InstructorInformationSystemResponse(
    Long id,
    Long userKey,
    Long timeKey,
    LocalDateTime timestamp,
    Long assignmentId
) {
    public static InstructorInformationSystemResponse from(InstructorInformationSystem iis) {
        return new InstructorInformationSystemResponse(
            iis.getId(),
            iis.getUserKey(),
            iis.getTimeKey(),
            iis.getTimestamp(),
            iis.getAssignment().getId()
        );
    }
}
