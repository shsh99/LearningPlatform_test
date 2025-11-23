package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

/**
 * 이미 수강 신청한 강의일 때 발생하는 예외
 */
public class AlreadyEnrolledException extends BusinessException {

    public AlreadyEnrolledException() {
        super(ErrorCode.ALREADY_ENROLLED);
    }

    public AlreadyEnrolledException(String message) {
        super(ErrorCode.ALREADY_ENROLLED, message);
    }
}
