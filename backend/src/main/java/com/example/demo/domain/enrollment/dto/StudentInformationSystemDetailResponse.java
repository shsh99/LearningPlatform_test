package com.example.demo.domain.enrollment.dto;

import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.entity.StudentInformationSystem;

import java.time.LocalDateTime;

public record StudentInformationSystemDetailResponse(
    Long id,
    Long userKey,
    Long timeKey,
    LocalDateTime timestamp,
    Long enrollmentId,

    // Student Info
    String studentName,
    String studentEmail,

    // Course Info
    String courseTitle,
    Integer termNumber,

    // Enrollment Info
    EnrollmentStatus enrollmentStatus,
    LocalDateTime enrollmentCreatedAt,

    // Progress (임시로 0으로 설정, 추후 실제 진도율 계산 로직 추가)
    Integer progressPercentage
) {
    public static StudentInformationSystemDetailResponse from(StudentInformationSystem sis) {
        var enrollment = sis.getEnrollment();
        var student = enrollment.getStudent();
        var term = enrollment.getTerm();
        var course = term.getCourse();

        return new StudentInformationSystemDetailResponse(
            sis.getId(),
            sis.getUserKey(),
            sis.getTimeKey(),
            sis.getTimestamp(),
            enrollment.getId(),
            student.getName(),
            student.getEmail(),
            course.getTitle(),
            term.getTermNumber(),
            enrollment.getStatus(),
            enrollment.getCreatedAt(),
            0  // 임시 진도율, 추후 실제 계산 로직 추가
        );
    }
}
