package com.example.demo.domain.auth.dto;

import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;

public record AuthResponse(
    Long id,
    String email,
    String name,
    UserRole role,
    Long tenantId,
    String tenantCode,
    TokenResponse tokens
) {
    public static AuthResponse of(User user, TokenResponse tokens) {
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getTenantId(),
            null,
            tokens
        );
    }

    public static AuthResponse of(User user, String tenantCode, TokenResponse tokens) {
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getTenantId(),
            tenantCode,
            tokens
        );
    }
}
