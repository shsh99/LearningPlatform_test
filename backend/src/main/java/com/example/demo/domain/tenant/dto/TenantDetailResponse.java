package com.example.demo.domain.tenant.dto;

import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.entity.TenantStatus;

import java.time.LocalDateTime;

public record TenantDetailResponse(
        Long id,
        String code,
        String name,
        String domain,
        TenantStatus status,
        TenantBrandingResponse branding,
        TenantSettingsResponse settings,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TenantDetailResponse from(Tenant tenant) {
        return new TenantDetailResponse(
                tenant.getId(),
                tenant.getCode(),
                tenant.getName(),
                tenant.getDomain(),
                tenant.getStatus(),
                TenantBrandingResponse.from(tenant.getBranding()),
                TenantSettingsResponse.from(tenant.getSettings()),
                tenant.getCreatedAt(),
                tenant.getUpdatedAt()
        );
    }
}
