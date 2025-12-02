package com.example.demo.global.tenant;

import lombok.extern.slf4j.Slf4j;

/**
 * 테넌트 보안 관련 유틸리티 클래스
 * 크로스 테넌트 접근 검증 기능 제공
 */
@Slf4j
public class TenantSecurityUtils {

    private TenantSecurityUtils() {
        // 유틸리티 클래스 - 인스턴스화 방지
    }

    /**
     * 현재 테넌트가 대상 테넌트에 접근 가능한지 검증
     * SUPER_ADMIN (tenantId = null)은 모든 테넌트 접근 가능
     *
     * @param targetTenantId 접근하려는 대상 테넌트 ID
     * @throws UnauthorizedTenantAccessException 크로스 테넌트 접근 시
     */
    public static void validateTenantAccess(Long targetTenantId) {
        Long currentTenantId = TenantContext.getTenantId();

        // SUPER_ADMIN (tenantId = null)은 모든 테넌트 접근 가능
        if (currentTenantId == null) {
            log.debug("SUPER_ADMIN access to tenant: {}", targetTenantId);
            return;
        }

        // 자신의 테넌트만 접근 가능
        if (!currentTenantId.equals(targetTenantId)) {
            log.warn("Cross-tenant access denied: currentTenant={}, targetTenant={}",
                     currentTenantId, targetTenantId);
            throw new UnauthorizedTenantAccessException(currentTenantId, targetTenantId);
        }
    }

    /**
     * 현재 요청이 SUPER_ADMIN인지 확인
     * TenantContext의 tenantId가 null이면 SUPER_ADMIN
     *
     * @return SUPER_ADMIN 여부
     */
    public static boolean isSuperAdmin() {
        return TenantContext.getTenantId() == null;
    }

    /**
     * 현재 테넌트 ID 반환 (없으면 null)
     *
     * @return 현재 테넌트 ID
     */
    public static Long getCurrentTenantId() {
        return TenantContext.getTenantId();
    }
}
