package com.example.demo.domain.user.dto;

import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.entity.UserStatus;

import java.time.LocalDateTime;

/**
 * 유저 Response DTO
 */
public record UserResponse(
    Long id,
    String email,
    String name,
    UserRole role,
    UserStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getStatus(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
