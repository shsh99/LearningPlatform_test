package com.example.demo.global.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private final String code;
    private final String message;
    private final LocalDateTime timestamp;
    private final Map<String, String> errors;  // 필드별 유효성 검증 오류

    @Builder
    private ErrorResponse(String code, String message, Map<String, String> errors) {
        this.code = code;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.errors = errors;
    }

    public static ErrorResponse of(ErrorCode errorCode) {
        return ErrorResponse.builder()
            .code(errorCode.getCode())
            .message(errorCode.getMessage())
            .build();
    }

    public static ErrorResponse of(ErrorCode errorCode, String message) {
        return ErrorResponse.builder()
            .code(errorCode.getCode())
            .message(message != null ? message : errorCode.getMessage())
            .build();
    }

    public static ErrorResponse ofValidation(ErrorCode errorCode, String message, Map<String, String> errors) {
        return ErrorResponse.builder()
            .code(errorCode.getCode())
            .message(message)
            .errors(errors)
            .build();
    }
}
