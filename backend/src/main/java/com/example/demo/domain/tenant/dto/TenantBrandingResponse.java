package com.example.demo.domain.tenant.dto;

import com.example.demo.domain.tenant.entity.TenantBranding;

public record TenantBrandingResponse(
        Long tenantId,
        String logoUrl,
        String faviconUrl,
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
        String backgroundColor,
        String fontFamily,
        String fontUrl,
        String customCss,
        String layoutConfig
) {
    public static TenantBrandingResponse from(TenantBranding branding) {
        if (branding == null) {
            return null;
        }
        return new TenantBrandingResponse(
                branding.getTenantId(),
                branding.getLogoUrl(),
                branding.getFaviconUrl(),
                branding.getPrimaryColor(),
                branding.getSecondaryColor(),
                branding.getAccentColor(),
                branding.getHeaderBgColor(),
                branding.getHeaderTextColor(),
                branding.getSidebarBgColor(),
                branding.getSidebarTextColor(),
                branding.getSidebarActiveColor(),
                branding.getSidebarActiveTextColor(),
                branding.getButtonPrimaryBgColor(),
                branding.getButtonPrimaryTextColor(),
                branding.getButtonSecondaryBgColor(),
                branding.getButtonSecondaryTextColor(),
                branding.getBackgroundColor(),
                branding.getFontFamily(),
                branding.getFontUrl(),
                branding.getCustomCss(),
                branding.getLayoutConfig()
        );
    }
}
