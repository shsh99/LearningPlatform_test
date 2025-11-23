package com.example.demo.domain.courseapplication.dto;

import com.example.demo.domain.courseapplication.entity.ApplicationStatus;
import com.example.demo.domain.courseapplication.entity.CourseApplication;

import java.time.LocalDateTime;

/**
 * 강의 개설 신청 Response DTO
 */
public record CourseApplicationResponse(
    Long id,
    Long courseId,
    Long applicantId,
    String applicantName,
    String applicantEmail,
    String title,
    String description,
    ApplicationStatus status,
    String rejectionReason,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static CourseApplicationResponse from(CourseApplication application) {
        return new CourseApplicationResponse(
            application.getId(),
            application.getCourse() != null ? application.getCourse().getId() : null,
            application.getApplicant().getId(),
            application.getApplicant().getName(),
            application.getApplicant().getEmail(),
            application.getTitle(),
            application.getDescription(),
            application.getStatus(),
            application.getRejectionReason(),
            application.getCreatedAt(),
            application.getUpdatedAt()
        );
    }
}
