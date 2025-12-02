package com.example.demo.domain.user.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

public class AccountLockedException extends BusinessException {

    public AccountLockedException() {
        super(ErrorCode.ACCOUNT_LOCKED);
    }

    public AccountLockedException(int remainingMinutes) {
        super(ErrorCode.ACCOUNT_LOCKED,
            String.format("계정이 잠겼습니다. %d분 후에 다시 시도해주세요.", remainingMinutes));
    }
}
