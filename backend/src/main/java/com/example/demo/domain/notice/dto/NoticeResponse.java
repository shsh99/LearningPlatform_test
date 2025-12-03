package com.example.demo.domain.notice.dto;

import com.example.demo.domain.notice.entity.Notice;
import com.example.demo.domain.notice.entity.NoticeType;

import java.time.LocalDateTime;

public record NoticeResponse(
        Long id,
        NoticeType type,
        Long tenantId,
        String title,
        String content,
        Boolean enabled,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Long createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static NoticeResponse from(Notice notice) {
        return new NoticeResponse(
                notice.getId(),
                notice.getType(),
                notice.getTenantId(),
                notice.getTitle(),
                notice.getContent(),
                notice.getEnabled(),
                notice.getStartDate(),
                notice.getEndDate(),
                notice.getCreatedBy(),
                notice.getCreatedAt(),
                notice.getUpdatedAt()
        );
    }
}
