package com.example.demo.domain.tenantapplication.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 테넌트 신청 엔티티
 * 회사가 플랫폼 사용을 신청하면 PENDING 상태로 저장되고,
 * SUPER_ADMIN이 승인/거절할 수 있습니다.
 */
@Entity
@Table(name = "tenant_applications")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class TenantApplication extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String companyName;

    @Column(nullable = false, unique = true, length = 50)
    private String companyCode;

    @Column(nullable = false, length = 50)
    private String adminName;

    @Column(nullable = false, unique = true, length = 100)
    private String adminEmail;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 20)
    private String businessNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "processed_by")
    private Long processedBy;  // SUPER_ADMIN ID

    private TenantApplication(
            String companyName,
            String companyCode,
            String adminName,
            String adminEmail,
            String phoneNumber,
            String businessNumber,
            String description
    ) {
        this.companyName = companyName;
        this.companyCode = companyCode;
        this.adminName = adminName;
        this.adminEmail = adminEmail;
        this.phoneNumber = phoneNumber;
        this.businessNumber = businessNumber;
        this.description = description;
        this.status = ApplicationStatus.PENDING;
    }

    public static TenantApplication create(
            String companyName,
            String companyCode,
            String adminName,
            String adminEmail,
            String phoneNumber,
            String businessNumber,
            String description
    ) {
        return new TenantApplication(
                companyName,
                companyCode,
                adminName,
                adminEmail,
                phoneNumber,
                businessNumber,
                description
        );
    }

    public void approve(Long processedBy) {
        this.status = ApplicationStatus.APPROVED;
        this.processedAt = LocalDateTime.now();
        this.processedBy = processedBy;
    }

    public void reject(String rejectionReason, Long processedBy) {
        this.status = ApplicationStatus.REJECTED;
        this.rejectionReason = rejectionReason;
        this.processedAt = LocalDateTime.now();
        this.processedBy = processedBy;
    }

    public boolean isPending() {
        return this.status == ApplicationStatus.PENDING;
    }

    public boolean isApproved() {
        return this.status == ApplicationStatus.APPROVED;
    }

    public boolean isRejected() {
        return this.status == ApplicationStatus.REJECTED;
    }
}
