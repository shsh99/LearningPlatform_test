package com.example.demo.domain.tenant.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Tenant extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;  // samsung, kakao, hyundai 등

    @Column(nullable = false, length = 100)
    private String name;  // 삼성전자, 카카오, 현대자동차

    @Column(length = 255)
    private String domain;  // samsung.learning.com

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TenantStatus status;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToOne(mappedBy = "tenant", fetch = FetchType.LAZY)
    private TenantBranding branding;

    @OneToOne(mappedBy = "tenant", fetch = FetchType.LAZY)
    private TenantSettings settings;

    private Tenant(String code, String name, String domain) {
        this.code = code;
        this.name = name;
        this.domain = domain;
        this.status = TenantStatus.ACTIVE;
    }

    public static Tenant create(String code, String name, String domain) {
        return new Tenant(code, name, domain);
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updateDomain(String domain) {
        this.domain = domain;
    }

    public void activate() {
        this.status = TenantStatus.ACTIVE;
    }

    public void deactivate() {
        this.status = TenantStatus.INACTIVE;
    }

    public void suspend() {
        this.status = TenantStatus.SUSPENDED;
    }

    public void delete() {
        this.status = TenantStatus.DELETED;
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return this.status == TenantStatus.ACTIVE;
    }

    // ===== 비즈니스 메서드 (연관관계 설정) =====
    public void assignBranding(TenantBranding branding) {
        this.branding = branding;
    }

    public void assignSettings(TenantSettings settings) {
        this.settings = settings;
    }
}
