package com.example.demo.domain.enrollment.exception;

import com.example.demo.global.exception.ConflictException;
import com.example.demo.global.exception.ErrorCode;

public class EnrollmentAlreadyCancelledException extends ConflictException {

    public EnrollmentAlreadyCancelledException() {
        super(ErrorCode.ENROLLMENT_ALREADY_CANCELLED);
    }

    public EnrollmentAlreadyCancelledException(Long enrollmentId) {
        super(ErrorCode.ENROLLMENT_ALREADY_CANCELLED,
            String.format("이미 취소된 수강입니다. (ID: %d)", enrollmentId));
    }
}
