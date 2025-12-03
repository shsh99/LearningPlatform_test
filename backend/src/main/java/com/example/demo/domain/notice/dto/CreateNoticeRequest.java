package com.example.demo.domain.notice.dto;

import com.example.demo.domain.notice.entity.NoticeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateNoticeRequest(
        @NotNull(message = "공지 타입은 필수입니다")
        NoticeType type,

        Long tenantId,  // TENANT 타입인 경우 필수

        @NotBlank(message = "제목은 필수입니다")
        @Size(max = 200, message = "제목은 200자 이내여야 합니다")
        String title,

        @NotBlank(message = "내용은 필수입니다")
        String content,

        LocalDateTime startDate,

        LocalDateTime endDate
) {
}
