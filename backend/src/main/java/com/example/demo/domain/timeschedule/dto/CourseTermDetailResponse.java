package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.user.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

/**
 * 강의 기수 상세 조회 Response (수강생 목록 포함)
 */
public record CourseTermDetailResponse(
        Long id,
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
        LocalTime enrollmentStartTime,
        LocalTime enrollmentEndTime,
        String enrollmentType,
        Integer minStudents,
        AssignedInstructorDto instructor,
        List<EnrolledStudentDto> enrolledStudents,
        LocalDateTime createdAt
) {
    /**
     * 배정된 강사 정보
     */
    public record AssignedInstructorDto(
            Long assignmentId,
            Long instructorId,
            String instructorName,
            String instructorEmail,
            LocalDateTime assignedAt
    ) {
        public static AssignedInstructorDto from(InstructorAssignment assignment) {
            User instructor = assignment.getInstructor();
            return new AssignedInstructorDto(
                    assignment.getId(),
                    instructor.getId(),
                    instructor.getName(),
                    instructor.getEmail(),
                    assignment.getCreatedAt()
            );
        }
    }

    /**
     * 수강생 정보
     */
    public record EnrolledStudentDto(
            Long enrollmentId,
            Long studentId,
            String studentName,
            String studentEmail,
            EnrollmentStatus status,
            LocalDateTime enrolledAt
    ) {
        public static EnrolledStudentDto from(Enrollment enrollment) {
            User student = enrollment.getStudent();
            return new EnrolledStudentDto(
                    enrollment.getId(),
                    student.getId(),
                    student.getName(),
                    maskEmail(student.getEmail()),
                    enrollment.getStatus(),
                    enrollment.getCreatedAt()
            );
        }

        /**
         * 이메일 마스킹 처리
         * 예: user@example.com -> use***@example.com
         */
        private static String maskEmail(String email) {
            if (email == null || email.isEmpty()) {
                return "";
            }

            int atIndex = email.indexOf('@');
            if (atIndex <= 0) {
                return email;
            }

            String localPart = email.substring(0, atIndex);
            String domain = email.substring(atIndex);

            if (localPart.length() <= 3) {
                return localPart.charAt(0) + "***" + domain;
            }

            return localPart.substring(0, 3) + "***" + domain;
        }
    }

    /**
     * CourseTerm 엔티티로부터 DetailResponse 생성
     */
    public static CourseTermDetailResponse from(
            CourseTerm term,
            List<Enrollment> enrollments,
            InstructorAssignment currentInstructor) {

        // 유효한 수강생만 필터링 (ENROLLED, COMPLETED)
        List<EnrolledStudentDto> students = enrollments.stream()
                .filter(e -> e.getStatus() == EnrollmentStatus.ENROLLED ||
                            e.getStatus() == EnrollmentStatus.COMPLETED)
                .map(EnrolledStudentDto::from)
                .toList();

        // 강사 정보 (없을 수도 있음)
        AssignedInstructorDto instructorDto = currentInstructor != null
                ? AssignedInstructorDto.from(currentInstructor)
                : null;

        return new CourseTermDetailResponse(
                term.getId(),
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
                term.getEnrollmentStartTime(),
                term.getEnrollmentEndTime(),
                term.getEnrollmentType() != null ? term.getEnrollmentType().name() : null,
                term.getMinStudents(),
                instructorDto,
                students,
                term.getCreatedAt()
        );
    }
}
