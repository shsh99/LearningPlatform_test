package com.example.demo.global.exception;

/**
 * 할당량 초과 예외 (402 Payment Required)
 * - 사용자 수 한도 초과
 * - 강의 수 한도 초과
 * - 스토리지 한도 초과
 */
public class QuotaExceededException extends BusinessException {

    public QuotaExceededException(ErrorCode errorCode) {
        super(errorCode);
    }

    public QuotaExceededException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
