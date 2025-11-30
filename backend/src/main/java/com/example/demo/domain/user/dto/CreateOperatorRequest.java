package com.example.demo.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 테넌트 어드민이 오퍼레이터를 생성하기 위한 요청 DTO
 * tenantId는 요청자(TENANT_ADMIN)의 테넌트에서 가져옴
 */
public record CreateOperatorRequest(
        @NotBlank(message = "이메일은 필수입니다")
        @Email(message = "올바른 이메일 형식이 아닙니다")
        String email,

        @NotBlank(message = "비밀번호는 필수입니다")
        @Size(min = 8, max = 20, message = "비밀번호는 8~20자여야 합니다")
        String password,

        @NotBlank(message = "이름은 필수입니다")
        @Size(min = 2, max = 20, message = "이름은 2~20자여야 합니다")
        String name
) {
}
