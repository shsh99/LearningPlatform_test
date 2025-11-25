package com.example.demo.domain.auth.dto;

public record TokenResponse(
    String accessToken,
    String refreshToken,
    Long expiresIn
) {
    public static TokenResponse of(String accessToken, String refreshToken, long expiresInMillis) {
        return new TokenResponse(accessToken, refreshToken, expiresInMillis / 1000);
    }
}
