package com.example.demo.domain.user.dto;

import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.entity.UserStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 사용자 프로필 Response DTO
 * 사용자의 기본 정보, 강사로 배정된 강의, 수강 중인 강의를 포함
 */
public record UserProfileResponse(
    Long id,
    String email,
    String name,
    UserRole role,
    UserStatus status,
    LocalDateTime createdAt,
    List<InstructorAssignmentInfo> instructorAssignments,
    List<EnrollmentInfo> enrollments
) {
    public static UserProfileResponse of(
        User user,
        List<InstructorAssignmentInfo> instructorAssignments,
        List<EnrollmentInfo> enrollments
    ) {
        return new UserProfileResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getStatus(),
            user.getCreatedAt(),
            instructorAssignments,
            enrollments
        );
    }

    /**
     * 강사 배정 정보
     */
    public record InstructorAssignmentInfo(
        Long assignmentId,
        Long termId,
        Integer termNumber,
        String courseTitle,
        String courseDescription,
        java.time.LocalDate startDate,
        java.time.LocalDate endDate,
        Integer maxStudents,
        Integer currentStudents,
        String termStatus,
        String assignmentStatus
    ) {}

    /**
     * 수강 정보
     */
    public record EnrollmentInfo(
        Long enrollmentId,
        Long termId,
        Integer termNumber,
        String courseTitle,
        String courseDescription,
        java.time.LocalDate startDate,
        java.time.LocalDate endDate,
        String termStatus,
        String enrollmentStatus,
        LocalDateTime enrolledAt
    ) {}
}
