package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.AssignmentStatus;
import com.example.demo.domain.timeschedule.entity.InstructorInformationSystem;

import java.time.LocalDateTime;

/**
 * IIS 상세 조회 Response (SIS와 유사한 구조)
 * 강사 정보, 강의 정보, 배정 상태 등을 포함
 */
public record InstructorInformationSystemDetailResponse(
    Long id,
    Long userKey,
    Long timeKey,
    LocalDateTime timestamp,

    // Assignment 정보
    Long assignmentId,
    AssignmentStatus assignmentStatus,
    LocalDateTime assignedAt,

    // Instructor 정보
    Long instructorId,
    String instructorName,
    String instructorEmail, // 마스킹된 이메일

    // AssignedBy 정보
    Long assignedById,
    String assignedByName,

    // CourseTerm 정보
    Long termId,
    Integer termNumber,
    String courseTitle,
    Long courseId
) {
    public static InstructorInformationSystemDetailResponse from(InstructorInformationSystem iis) {
        String maskedEmail = maskEmail(iis.getAssignment().getInstructor().getEmail());

        return new InstructorInformationSystemDetailResponse(
            iis.getId(),
            iis.getUserKey(),
            iis.getTimeKey(),
            iis.getTimestamp(),

            // Assignment
            iis.getAssignment().getId(),
            iis.getAssignment().getStatus(),
            iis.getAssignment().getCreatedAt(),

            // Instructor
            iis.getAssignment().getInstructor().getId(),
            iis.getAssignment().getInstructor().getName(),
            maskedEmail,

            // AssignedBy
            iis.getAssignment().getAssignedBy().getId(),
            iis.getAssignment().getAssignedBy().getName(),

            // CourseTerm
            iis.getAssignment().getTerm().getId(),
            iis.getAssignment().getTerm().getTermNumber(),
            iis.getAssignment().getTerm().getCourse().getTitle(),
            iis.getAssignment().getTerm().getCourse().getId()
        );
    }

    /**
     * 이메일 마스킹 처리
     * 예: "instructor@example.com" -> "ins***@example.com"
     */
    private static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }

        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];

        if (localPart.length() <= 3) {
            return localPart.charAt(0) + "***@" + domain;
        }

        return localPart.substring(0, 3) + "***@" + domain;
    }
}
