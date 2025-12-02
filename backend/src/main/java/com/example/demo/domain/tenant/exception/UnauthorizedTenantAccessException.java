package com.example.demo.domain.tenant.exception;

import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.ForbiddenException;

public class UnauthorizedTenantAccessException extends ForbiddenException {

    public UnauthorizedTenantAccessException() {
        super(ErrorCode.UNAUTHORIZED_TENANT_ACCESS);
    }

    public UnauthorizedTenantAccessException(Long userTenantId, Long resourceTenantId) {
        super(ErrorCode.UNAUTHORIZED_TENANT_ACCESS,
            String.format("다른 테넌트의 리소스에 접근할 수 없습니다. (사용자 테넌트: %d, 리소스 테넌트: %d)",
                userTenantId, resourceTenantId));
    }
}
