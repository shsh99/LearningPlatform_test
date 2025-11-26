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

        // 수료 상태일 경우 100%, 그 외에는 0% (추후 실제 진도율 계산 로직 추가 예정)
        Integer progressPercentage = enrollment.getStatus() == EnrollmentStatus.COMPLETED ? 100 : 0;

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
            progressPercentage
        );
    }
}
