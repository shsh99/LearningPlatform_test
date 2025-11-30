package com.example.demo.domain.tenantapplication.dto;

import com.example.demo.domain.tenantapplication.entity.ApplicationStatus;
import com.example.demo.domain.tenantapplication.entity.TenantApplication;

import java.time.LocalDateTime;

/**
 * 테넌트 신청 응답 DTO
 */
public record TenantApplicationResponse(
        Long id,
        String companyName,
        String companyCode,
        String adminName,
        String adminEmail,
        String phoneNumber,
        String businessNumber,
        String description,
        ApplicationStatus status,
        String rejectionReason,
        LocalDateTime processedAt,
        Long processedBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TenantApplicationResponse from(TenantApplication application) {
        return new TenantApplicationResponse(
                application.getId(),
                application.getCompanyName(),
                application.getCompanyCode(),
                application.getAdminName(),
                application.getAdminEmail(),
                application.getPhoneNumber(),
                application.getBusinessNumber(),
                application.getDescription(),
                application.getStatus(),
                application.getRejectionReason(),
                application.getProcessedAt(),
                application.getProcessedBy(),
                application.getCreatedAt(),
                application.getUpdatedAt()
        );
    }
}
