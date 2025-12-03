package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import com.example.demo.domain.timeschedule.entity.EnrollmentType;
import com.example.demo.domain.timeschedule.entity.TermStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

public record CourseTermResponse(
    Long id,
    Long courseId,
    String courseTitle,
    Integer termNumber,
    LocalDate startDate,
    LocalDate endDate,
    Set<DayOfWeek> daysOfWeek,
    LocalTime startTime,
    LocalTime endTime,
    Integer maxStudents,
    Integer currentStudents,
    TermStatus status,
    // ===== 모집 관리 필드 =====
    LocalDate enrollmentStartDate,
    LocalDate enrollmentEndDate,
    EnrollmentType enrollmentType,
    Integer minStudents,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static CourseTermResponse from(CourseTerm term) {
        return new CourseTermResponse(
            term.getId(),
            term.getCourse().getId(),
            term.getCourse().getTitle(),
            term.getTermNumber(),
            term.getStartDate(),
            term.getEndDate(),
            term.getDaysOfWeek(),
            term.getStartTime(),
            term.getEndTime(),
            term.getMaxStudents(),
            term.getCurrentStudents(),
            term.getStatus(),
            term.getEnrollmentStartDate(),
            term.getEnrollmentEndDate(),
            term.getEnrollmentType(),
            term.getMinStudents(),
            term.getCreatedAt(),
            term.getUpdatedAt()
        );
    }
}
