package com.example.demo.domain.tenant.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

public class TenantNotFoundException extends BusinessException {

    public TenantNotFoundException(Long tenantId) {
        super(ErrorCode.TENANT_NOT_FOUND, "테넌트를 찾을 수 없습니다. ID: " + tenantId);
    }

    public TenantNotFoundException(String code) {
        super(ErrorCode.TENANT_NOT_FOUND, "테넌트를 찾을 수 없습니다. 코드: " + code);
    }
}
