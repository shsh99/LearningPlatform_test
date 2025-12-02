package com.example.demo.domain.tenant.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tenant_brandings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class TenantBranding extends BaseTimeEntity {

    @Id
    private Long tenantId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    // 로고 설정
    @Column(length = 500)
    private String logoUrl;

    @Column(length = 500)
    private String faviconUrl;

    // 기본 색상
    @Column(length = 20)
    private String primaryColor = "#3B82F6";

    @Column(length = 20)
    private String secondaryColor = "#6B7280";

    @Column(length = 20)
    private String accentColor = "#8B5CF6";

    // 헤더 설정
    @Column(length = 20)
    private String headerBgColor = "#FFFFFF";

    @Column(length = 20)
    private String headerTextColor = "#111827";

    // 사이드바 설정
    @Column(length = 20)
    private String sidebarBgColor = "#F9FAFB";

    @Column(length = 20)
    private String sidebarTextColor = "#374151";

    @Column(length = 20)
    private String sidebarActiveColor = "#EFF6FF";

    @Column(length = 20)
    private String sidebarActiveTextColor = "#3B82F6";

    // 버튼 설정
    @Column(length = 20)
    private String buttonPrimaryBgColor = "#3B82F6";

    @Column(length = 20)
    private String buttonPrimaryTextColor = "#FFFFFF";

    @Column(length = 20)
    private String buttonSecondaryBgColor = "#F3F4F6";

    @Column(length = 20)
    private String buttonSecondaryTextColor = "#374151";

    // 배경 설정
    @Column(length = 20)
    private String backgroundColor = "";  // 빈 문자열이면 테마 프리셋 자동 적용

    // 폰트 설정
    @Column(length = 100)
    private String fontFamily = "Pretendard, -apple-system, sans-serif";

    @Column(length = 500)
    private String fontUrl;

    // 기타 커스텀 CSS (선택적)
    @Column(columnDefinition = "TEXT")
    private String customCss;

    // 레이아웃 설정 (JSON 형태로 저장)
    @Column(columnDefinition = "TEXT")
    private String layoutConfig;

    private TenantBranding(Tenant tenant) {
        this.tenant = tenant;
    }

    public static TenantBranding createDefault(Tenant tenant) {
        return new TenantBranding(tenant);
    }

    public void updateLogo(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public void updateFavicon(String faviconUrl) {
        this.faviconUrl = faviconUrl;
    }

    public void updatePrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public void updateSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public void updateAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }

    public void updateHeaderColors(String bgColor, String textColor) {
        this.headerBgColor = bgColor;
        this.headerTextColor = textColor;
    }

    public void updateSidebarColors(String bgColor, String textColor, String activeColor, String activeTextColor) {
        this.sidebarBgColor = bgColor;
        this.sidebarTextColor = textColor;
        this.sidebarActiveColor = activeColor;
        this.sidebarActiveTextColor = activeTextColor;
    }

    public void updateButtonColors(String primaryBg, String primaryText, String secondaryBg, String secondaryText) {
        this.buttonPrimaryBgColor = primaryBg;
        this.buttonPrimaryTextColor = primaryText;
        this.buttonSecondaryBgColor = secondaryBg;
        this.buttonSecondaryTextColor = secondaryText;
    }

    public void updateBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public void updateFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
    }

    public void updateFontUrl(String fontUrl) {
        this.fontUrl = fontUrl;
    }

    public void updateCustomCss(String customCss) {
        this.customCss = customCss;
    }

    public void updateLayoutConfig(String layoutConfig) {
        this.layoutConfig = layoutConfig;
    }

    public void updateAllColors(
            String primaryColor,
            String secondaryColor,
            String accentColor,
            String headerBgColor,
            String headerTextColor,
            String sidebarBgColor,
            String sidebarTextColor,
            String sidebarActiveColor,
            String sidebarActiveTextColor,
            String buttonPrimaryBgColor,
            String buttonPrimaryTextColor,
            String buttonSecondaryBgColor,
            String buttonSecondaryTextColor,
            String backgroundColor
    ) {
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.accentColor = accentColor;
        this.headerBgColor = headerBgColor;
        this.headerTextColor = headerTextColor;
        this.sidebarBgColor = sidebarBgColor;
        this.sidebarTextColor = sidebarTextColor;
        this.sidebarActiveColor = sidebarActiveColor;
        this.sidebarActiveTextColor = sidebarActiveTextColor;
        this.buttonPrimaryBgColor = buttonPrimaryBgColor;
        this.buttonPrimaryTextColor = buttonPrimaryTextColor;
        this.buttonSecondaryBgColor = buttonSecondaryBgColor;
        this.buttonSecondaryTextColor = buttonSecondaryTextColor;
        this.backgroundColor = backgroundColor;
    }
}
