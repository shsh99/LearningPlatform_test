package com.example.demo.domain.auth.dto;

import com.example.demo.domain.user.entity.User;

public record AuthResponse(
    Long id,
    String email,
    String name,
    String token
) {
    public static AuthResponse of(User user, String token) {
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            token
        );
    }
}
