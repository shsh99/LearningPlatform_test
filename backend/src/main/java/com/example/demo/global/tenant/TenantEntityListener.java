package com.example.demo.global.tenant;

import jakarta.persistence.PrePersist;
import lombok.extern.slf4j.Slf4j;

/**
 * TenantAware 엔티티의 tenantId를 자동으로 설정하는 EntityListener
 *
 * 신규 엔티티 저장 시 TenantContext의 tenantId를 자동으로 할당합니다.
 * 개발자가 명시적으로 tenantId를 설정하지 않아도 됩니다.
 */
@Slf4j
public class TenantEntityListener {

    @PrePersist
    public void setTenantId(Object entity) {
        if (entity instanceof TenantAware) {
            TenantAware tenantAware = (TenantAware) entity;

            // 이미 tenantId가 설정되어 있으면 그대로 유지 (명시적 설정 우선)
            if (tenantAware.getTenantId() != null) {
                log.debug("TenantId already set: {}", tenantAware.getTenantId());
                return;
            }

            // TenantContext에서 현재 테넌트 ID 가져오기
            Long tenantId = TenantContext.getTenantId();
            if (tenantId == null) {
                log.warn("No tenant ID in context. Entity will be saved without tenantId: {}",
                    entity.getClass().getSimpleName());
                return;
            }

            // Reflection을 사용하여 tenantId 설정
            try {
                entity.getClass().getDeclaredField("tenantId").setAccessible(true);
                entity.getClass().getDeclaredField("tenantId").set(entity, tenantId);
                log.debug("Auto-set tenantId {} for entity: {}",
                    tenantId, entity.getClass().getSimpleName());
            } catch (Exception e) {
                log.error("Failed to auto-set tenantId for entity: {}",
                    entity.getClass().getSimpleName(), e);
            }
        }
    }
}
