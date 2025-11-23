package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.TermStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CourseTermResponse(
    Long id,
    Long courseId,
    String courseTitle,
    Integer termNumber,
    LocalDate startDate,
    LocalDate endDate,
    Integer maxStudents,
    Integer currentStudents,
    TermStatus status,
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
            term.getMaxStudents(),
            term.getCurrentStudents(),
            term.getStatus(),
            term.getCreatedAt(),
            term.getUpdatedAt()
        );
    }
}
