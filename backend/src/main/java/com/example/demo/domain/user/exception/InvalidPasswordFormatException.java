package com.example.demo.domain.user.exception;

import com.example.demo.global.exception.BadRequestException;
import com.example.demo.global.exception.ErrorCode;

public class InvalidPasswordFormatException extends BadRequestException {

    public InvalidPasswordFormatException() {
        super(ErrorCode.INVALID_PASSWORD_FORMAT);
    }

    public InvalidPasswordFormatException(String detail) {
        super(ErrorCode.INVALID_PASSWORD_FORMAT, detail);
    }
}
