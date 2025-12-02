package com.example.demo.global.tenant;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

/**
 * 다른 테넌트의 리소스에 접근 시도 시 발생하는 예외
 */
public class UnauthorizedTenantAccessException extends BusinessException {

    public UnauthorizedTenantAccessException() {
        super(ErrorCode.UNAUTHORIZED_TENANT_ACCESS);
    }

    public UnauthorizedTenantAccessException(Long currentTenantId, Long targetTenantId) {
        super(ErrorCode.UNAUTHORIZED_TENANT_ACCESS,
                String.format("Cross-tenant access denied: current=%d, target=%d", currentTenantId, targetTenantId));
    }
}
