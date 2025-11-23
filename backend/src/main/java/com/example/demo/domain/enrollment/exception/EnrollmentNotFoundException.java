package com.example.demo.domain.enrollment.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

public class EnrollmentNotFoundException extends BusinessException {
    public EnrollmentNotFoundException(Long id) {
        super(ErrorCode.ENROLLMENT_NOT_FOUND, "Enrollment not found with id: " + id);
    }
}
