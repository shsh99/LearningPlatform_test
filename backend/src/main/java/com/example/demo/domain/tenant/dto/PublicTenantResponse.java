package com.example.demo.domain.tenant.dto;

import com.example.demo.domain.tenant.entity.Tenant;

/**
 * 공개 API용 테넌트 정보 (인증 불필요)
 * 회원가입 시 테넌트 선택 드롭다운에서 사용
 */
public record PublicTenantResponse(
        String code,
        String name
) {
    public static PublicTenantResponse from(Tenant tenant) {
        return new PublicTenantResponse(
                tenant.getCode(),
                tenant.getName()
        );
    }
}
