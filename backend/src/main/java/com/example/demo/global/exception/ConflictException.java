package com.example.demo.global.exception;

/**
 * 리소스 충돌 예외 (409 Conflict)
 * - 중복 데이터
 * - 이미 처리된 요청
 * - 동시성 충돌
 */
public class ConflictException extends BusinessException {

    public ConflictException(ErrorCode errorCode) {
        super(errorCode);
    }

    public ConflictException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
