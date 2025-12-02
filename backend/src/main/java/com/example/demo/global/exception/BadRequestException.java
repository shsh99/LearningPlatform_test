package com.example.demo.global.exception;

/**
 * 잘못된 요청 예외 (400 Bad Request)
 * - 유효하지 않은 입력
 * - 비즈니스 규칙 위반
 */
public class BadRequestException extends BusinessException {

    public BadRequestException(ErrorCode errorCode) {
        super(errorCode);
    }

    public BadRequestException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
