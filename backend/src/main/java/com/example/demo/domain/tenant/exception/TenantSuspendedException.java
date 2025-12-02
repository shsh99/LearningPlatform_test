package com.example.demo.domain.tenant.exception;

import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.ForbiddenException;

public class TenantSuspendedException extends ForbiddenException {

    public TenantSuspendedException() {
        super(ErrorCode.TENANT_SUSPENDED);
    }

    public TenantSuspendedException(String tenantName) {
        super(ErrorCode.TENANT_SUSPENDED,
            String.format("정지된 테넌트입니다: %s. 관리자에게 문의하세요.", tenantName));
    }
}
