package com.example.demo.domain.enrollment.dto;

import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;

import java.time.LocalDateTime;

public record EnrollmentResponse(
    Long id,
    Long termId,
    Integer termNumber,
    String courseTitle,
    Long studentId,
    String studentName,
    EnrollmentStatus status,
    LocalDateTime enrolledAt
) {
    public static EnrollmentResponse from(Enrollment enrollment) {
        return new EnrollmentResponse(
            enrollment.getId(),
            enrollment.getTerm().getId(),
            enrollment.getTerm().getTermNumber(),
            enrollment.getTerm().getCourse().getTitle(),
            enrollment.getStudent().getId(),
            enrollment.getStudent().getName(),
            enrollment.getStatus(),
            enrollment.getCreatedAt()
        );
    }
}
