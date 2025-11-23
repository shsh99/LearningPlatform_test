package com.example.demo.domain.enrollment.dto;

import com.example.demo.domain.enrollment.entity.StudentInformationSystem;

import java.time.LocalDateTime;

public record StudentInformationSystemResponse(
    Long id,
    Long userKey,
    Long timeKey,
    LocalDateTime timestamp,
    Long enrollmentId
) {
    public static StudentInformationSystemResponse from(StudentInformationSystem sis) {
        return new StudentInformationSystemResponse(
            sis.getId(),
            sis.getUserKey(),
            sis.getTimeKey(),
            sis.getTimestamp(),
            sis.getEnrollment().getId()
        );
    }
}
