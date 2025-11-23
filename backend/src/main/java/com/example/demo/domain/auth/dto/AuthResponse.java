package com.example.demo.domain.auth.dto;

import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;

public record AuthResponse(
    Long id,
    String email,
    String name,
    UserRole role,
    String token
) {
    public static AuthResponse of(User user, String token) {
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            token
        );
    }
}
