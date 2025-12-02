package com.example.demo.domain.enrollment.exception;

import com.example.demo.global.exception.ConflictException;
import com.example.demo.global.exception.ErrorCode;

public class DuplicateEnrollmentException extends ConflictException {

    public DuplicateEnrollmentException() {
        super(ErrorCode.ALREADY_ENROLLED);
    }

    public DuplicateEnrollmentException(Long termId, Long studentId) {
        super(ErrorCode.ALREADY_ENROLLED,
            String.format("이미 수강신청된 차수입니다. (차수 ID: %d, 학생 ID: %d)", termId, studentId));
    }
}
