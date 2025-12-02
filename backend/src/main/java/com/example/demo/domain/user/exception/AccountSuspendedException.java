package com.example.demo.domain.user.exception;

import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.ForbiddenException;

public class AccountSuspendedException extends ForbiddenException {

    public AccountSuspendedException() {
        super(ErrorCode.ACCOUNT_SUSPENDED);
    }

    public AccountSuspendedException(String email) {
        super(ErrorCode.ACCOUNT_SUSPENDED, "정지된 계정입니다: " + email);
    }
}
