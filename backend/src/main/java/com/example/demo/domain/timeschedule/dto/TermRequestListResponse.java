package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.CourseTermChangeRequest;
import com.example.demo.domain.timeschedule.entity.CourseTermDeleteRequest;
import com.example.demo.domain.timeschedule.entity.TermRequestStatus;

import java.time.LocalDateTime;

/**
 * 차수 요청 목록 응답 DTO (변경/삭제 통합)
 */
public record TermRequestListResponse(
        Long id,
        String type,  // "CHANGE" or "DELETE"
        Long courseTermId,
        String courseName,
        Integer termNumber,
        Long requesterId,
        String requesterName,
        TermRequestStatus status,
        String reason,
        LocalDateTime createdAt
) {
    public static TermRequestListResponse fromChangeRequest(CourseTermChangeRequest request) {
        return new TermRequestListResponse(
                request.getId(),
                "CHANGE",
                request.getCourseTerm().getId(),
                request.getCourseTerm().getCourse().getTitle(),
                request.getCourseTerm().getTermNumber(),
                request.getRequester().getId(),
                request.getRequester().getName(),
                request.getStatus(),
                request.getReason(),
                request.getCreatedAt()
        );
    }

    public static TermRequestListResponse fromDeleteRequest(CourseTermDeleteRequest request) {
        return new TermRequestListResponse(
                request.getId(),
                "DELETE",
                request.getCourseTerm().getId(),
                request.getCourseTerm().getCourse().getTitle(),
                request.getCourseTerm().getTermNumber(),
                request.getRequester().getId(),
                request.getRequester().getName(),
                request.getStatus(),
                request.getReason(),
                request.getCreatedAt()
        );
    }
}
