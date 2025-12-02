package com.example.demo.domain.user.exception;

import com.example.demo.global.exception.ConflictException;
import com.example.demo.global.exception.ErrorCode;

public class EmailAlreadyExistsException extends ConflictException {

    public EmailAlreadyExistsException() {
        super(ErrorCode.EMAIL_ALREADY_EXISTS);
    }

    public EmailAlreadyExistsException(String email) {
        super(ErrorCode.EMAIL_ALREADY_EXISTS, "이미 사용 중인 이메일입니다: " + email);
    }
}
