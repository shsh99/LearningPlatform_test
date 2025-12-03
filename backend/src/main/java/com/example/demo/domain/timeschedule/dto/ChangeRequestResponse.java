package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.CourseTermChangeRequest;
import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import com.example.demo.domain.timeschedule.entity.TermRequestStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

/**
 * 차수 변경 요청 응답 DTO
 */
public record ChangeRequestResponse(
        Long id,
        Long courseTermId,
        String courseName,
        Integer termNumber,
        Long requesterId,
        String requesterName,
        TermRequestStatus status,

        // Before 스냅샷
        LocalDate beforeStartDate,
        LocalDate beforeEndDate,
        Set<DayOfWeek> beforeDaysOfWeek,
        LocalTime beforeStartTime,
        LocalTime beforeEndTime,
        Integer beforeMaxStudents,

        // After 스냅샷
        LocalDate afterStartDate,
        LocalDate afterEndDate,
        Set<DayOfWeek> afterDaysOfWeek,
        LocalTime afterStartTime,
        LocalTime afterEndTime,
        Integer afterMaxStudents,

        // 메타 정보
        String reason,
        Integer affectedStudentCount,
        String rejectionReason,
        Long processedById,
        String processedByName,
        LocalDateTime processedAt,
        LocalDateTime createdAt
) {
    public static ChangeRequestResponse from(CourseTermChangeRequest request) {
        return new ChangeRequestResponse(
                request.getId(),
                request.getCourseTerm().getId(),
                request.getCourseTerm().getCourse().getTitle(),
                request.getCourseTerm().getTermNumber(),
                request.getRequester().getId(),
                request.getRequester().getName(),
                request.getStatus(),
                request.getBeforeStartDate(),
                request.getBeforeEndDate(),
                request.getBeforeDaysOfWeek(),
                request.getBeforeStartTime(),
                request.getBeforeEndTime(),
                request.getBeforeMaxStudents(),
                request.getAfterStartDate(),
                request.getAfterEndDate(),
                request.getAfterDaysOfWeek(),
                request.getAfterStartTime(),
                request.getAfterEndTime(),
                request.getAfterMaxStudents(),
                request.getReason(),
                request.getAffectedStudentCount(),
                request.getRejectionReason(),
                request.getProcessedBy() != null ? request.getProcessedBy().getId() : null,
                request.getProcessedBy() != null ? request.getProcessedBy().getName() : null,
                request.getProcessedAt(),
                request.getCreatedAt()
        );
    }
}
