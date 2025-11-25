package com.example.demo.domain.user.dto;

import com.example.demo.global.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
    @NotBlank(message = "현재 비밀번호는 필수입니다.")
    String currentPassword,

    @NotBlank(message = "새 비밀번호는 필수입니다.")
    @ValidPassword
    @Size(max = 20, message = "비밀번호는 최대 20자까지 가능합니다.")
    String newPassword,

    @NotBlank(message = "비밀번호 확인은 필수입니다.")
    String confirmPassword
) {
}
