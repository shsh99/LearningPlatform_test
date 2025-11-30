package com.example.demo.global.tenant;

/**
 * 현재 요청의 테넌트 정보를 ThreadLocal에 저장하는 컨텍스트
 */
public class TenantContext {

    private static final ThreadLocal<Long> currentTenantId = new ThreadLocal<>();

    private TenantContext() {
        // 유틸리티 클래스
    }

    public static void setTenantId(Long tenantId) {
        currentTenantId.set(tenantId);
    }

    public static Long getTenantId() {
        return currentTenantId.get();
    }

    public static void clear() {
        currentTenantId.remove();
    }

    public static boolean hasTenant() {
        return currentTenantId.get() != null;
    }
}
