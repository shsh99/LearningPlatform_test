package com.example.demo.domain.timeschedule.dto;

import jakarta.validation.constraints.Size;

/**
 * 요청 반려 DTO
 */
public record RejectRequestDto(
        @Size(max = 500, message = "반려 사유는 500자 이내로 입력해주세요")
        String rejectionReason
) {}
