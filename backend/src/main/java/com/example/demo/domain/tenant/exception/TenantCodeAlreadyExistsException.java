package com.example.demo.domain.tenant.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

public class TenantCodeAlreadyExistsException extends BusinessException {

    public TenantCodeAlreadyExistsException(String code) {
        super(ErrorCode.TENANT_CODE_ALREADY_EXISTS, "이미 사용 중인 테넌트 코드입니다: " + code);
    }
}
