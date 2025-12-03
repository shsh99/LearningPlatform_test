package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.CourseTermDeleteRequest;
import com.example.demo.domain.timeschedule.entity.TermRequestStatus;

import java.time.LocalDateTime;

/**
 * 차수 삭제 요청 응답 DTO
 */
public record DeleteRequestResponse(
        Long id,
        Long courseTermId,
        String courseName,
        Integer termNumber,
        Long requesterId,
        String requesterName,
        TermRequestStatus status,
        String reason,
        String rejectionReason,
        Long processedById,
        String processedByName,
        LocalDateTime processedAt,
        LocalDateTime createdAt
) {
    public static DeleteRequestResponse from(CourseTermDeleteRequest request) {
        return new DeleteRequestResponse(
                request.getId(),
                request.getCourseTerm().getId(),
                request.getCourseTerm().getCourse().getTitle(),
                request.getCourseTerm().getTermNumber(),
                request.getRequester().getId(),
                request.getRequester().getName(),
                request.getStatus(),
                request.getReason(),
                request.getRejectionReason(),
                request.getProcessedBy() != null ? request.getProcessedBy().getId() : null,
                request.getProcessedBy() != null ? request.getProcessedBy().getName() : null,
                request.getProcessedAt(),
                request.getCreatedAt()
        );
    }
}
