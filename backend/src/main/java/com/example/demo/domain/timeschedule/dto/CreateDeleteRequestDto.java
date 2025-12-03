package com.example.demo.domain.timeschedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 차수 삭제 요청 생성 DTO
 */
public record CreateDeleteRequestDto(
        @NotNull(message = "차수 ID는 필수입니다")
        Long courseTermId,

        @NotBlank(message = "삭제 사유는 필수입니다")
        @Size(max = 500, message = "삭제 사유는 500자 이내로 입력해주세요")
        String reason
) {}
