package com.example.demo.domain.user.dto;

import com.example.demo.domain.user.entity.User;

/**
 * 사용자 검색 결과 DTO
 */
public record UserSearchResponse(
    Long id,
    String email,
    String name,
    String role,
    String status
) {
    public static UserSearchResponse from(User user) {
        return new UserSearchResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole().name(),
            user.getStatus().name()
        );
    }
}
