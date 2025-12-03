package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.ConflictException;
import com.example.demo.global.exception.ErrorCode;

/**
 * 해당 차수에 이미 대기 중인 요청이 있을 때 발생하는 예외
 */
public class DuplicatePendingRequestException extends ConflictException {

    public DuplicatePendingRequestException(Long termId) {
        super(ErrorCode.TERM_REQUEST_DUPLICATE_PENDING, "차수 ID: " + termId);
    }

    public DuplicatePendingRequestException() {
        super(ErrorCode.TERM_REQUEST_DUPLICATE_PENDING);
    }
}
