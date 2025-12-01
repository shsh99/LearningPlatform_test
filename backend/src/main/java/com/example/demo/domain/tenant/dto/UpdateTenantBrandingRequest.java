package com.example.demo.domain.tenant.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateTenantBrandingRequest(
        @Size(max = 500, message = "로고 URL은 500자 이하여야 합니다")
        String logoUrl,

        @Size(max = 500, message = "파비콘 URL은 500자 이하여야 합니다")
        String faviconUrl,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String primaryColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String secondaryColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String accentColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String headerBgColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String headerTextColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String sidebarBgColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String sidebarTextColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String sidebarActiveColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String sidebarActiveTextColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String buttonPrimaryBgColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String buttonPrimaryTextColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String buttonSecondaryBgColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 HEX 색상 코드를 입력하세요")
        String buttonSecondaryTextColor,

        @Pattern(regexp = "^(|#[0-9A-Fa-f]{6})$", message = "올바른 HEX 색상 코드를 입력하세요 (빈 문자열 허용)")
        String backgroundColor,

        @Size(max = 100, message = "폰트명은 100자 이하여야 합니다")
        String fontFamily,

        @Size(max = 500, message = "폰트 URL은 500자 이하여야 합니다")
        String fontUrl,

        String customCss
) {
}
