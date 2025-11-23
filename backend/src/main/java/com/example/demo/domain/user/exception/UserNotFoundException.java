package com.example.demo.domain.user.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

/**
 * 사용자를 찾을 수 없을 때 발생하는 예외
 */
public class UserNotFoundException extends BusinessException {

    public UserNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND, "사용자를 찾을 수 없습니다.");
    }

    public UserNotFoundException(Long id) {
        super(ErrorCode.USER_NOT_FOUND, "사용자를 찾을 수 없습니다. ID: " + id);
    }

    public UserNotFoundException(String email) {
        super(ErrorCode.USER_NOT_FOUND, "사용자를 찾을 수 없습니다. Email: " + email);
    }
}
