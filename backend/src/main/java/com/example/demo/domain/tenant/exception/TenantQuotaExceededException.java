package com.example.demo.domain.tenant.exception;

import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.QuotaExceededException;

public class TenantQuotaExceededException extends QuotaExceededException {

    public TenantQuotaExceededException(ErrorCode errorCode) {
        super(errorCode);
    }

    public static TenantQuotaExceededException userLimitExceeded(int current, int limit) {
        return new TenantQuotaExceededException(ErrorCode.TENANT_USER_LIMIT_EXCEEDED);
    }

    public static TenantQuotaExceededException courseLimitExceeded(int current, int limit) {
        return new TenantQuotaExceededException(ErrorCode.TENANT_COURSE_LIMIT_EXCEEDED);
    }

    public static TenantQuotaExceededException storageLimitExceeded(long used, long limit) {
        return new TenantQuotaExceededException(ErrorCode.TENANT_STORAGE_LIMIT_EXCEEDED);
    }
}
