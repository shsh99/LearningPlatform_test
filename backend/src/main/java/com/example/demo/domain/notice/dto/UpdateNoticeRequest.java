package com.example.demo.domain.notice.dto;

import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record UpdateNoticeRequest(
        @Size(max = 200, message = "제목은 200자 이내여야 합니다")
        String title,

        String content,

        Boolean enabled,

        LocalDateTime startDate,

        LocalDateTime endDate
) {
}
