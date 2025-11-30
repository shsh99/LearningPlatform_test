package com.example.demo.global.tenant;

/**
 * 테넌트 격리가 필요한 엔티티를 위한 마커 인터페이스
 * 이 인터페이스를 구현하는 엔티티는 자동으로 tenantId 필터가 적용됩니다.
 */
public interface TenantAware {
    Long getTenantId();
}
