package com.example.demo.domain.tenant.dto;

import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.entity.TenantStatus;

import java.time.LocalDateTime;

public record TenantResponse(
        Long id,
        String code,
        String name,
        String domain,
        TenantStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TenantResponse from(Tenant tenant) {
        return new TenantResponse(
                tenant.getId(),
                tenant.getCode(),
                tenant.getName(),
                tenant.getDomain(),
                tenant.getStatus(),
                tenant.getCreatedAt(),
                tenant.getUpdatedAt()
        );
    }
}
