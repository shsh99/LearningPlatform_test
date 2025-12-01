package com.example.demo.domain.tenant.service;

import com.example.demo.domain.tenant.dto.*;

import java.util.List;

public interface TenantService {

    // 테넌트 CRUD
    TenantResponse createTenant(CreateTenantRequest request);

    TenantDetailResponse getTenant(Long tenantId);

    TenantDetailResponse getTenantByCode(String code);

    List<TenantResponse> getAllTenants();

    List<TenantResponse> getActiveTenants();

    TenantResponse updateTenant(Long tenantId, UpdateTenantRequest request);

    void deleteTenant(Long tenantId);

    void activateTenant(Long tenantId);

    void deactivateTenant(Long tenantId);

    // 브랜딩 관리
    TenantBrandingResponse getBranding(Long tenantId);

    TenantBrandingResponse updateBranding(Long tenantId, UpdateTenantBrandingRequest request);

    // 설정 관리
    TenantSettingsResponse getSettings(Long tenantId);

    TenantSettingsResponse updateSettings(Long tenantId, UpdateTenantSettingsRequest request);

    // 라벨 관리
    TenantLabelsResponse getLabels(Long tenantId);

    TenantLabelsResponse updateLabels(Long tenantId, UpdateTenantLabelsRequest request);

    // 현재 테넌트 정보 조회 (Context 기반)
    TenantDetailResponse getCurrentTenant();

    TenantBrandingResponse getCurrentTenantBranding();

    TenantSettingsResponse getCurrentTenantSettings();

    TenantLabelsResponse getCurrentTenantLabels();

    // 현재 테넌트 정보 수정 (Context 기반, TENANT_ADMIN용)
    TenantBrandingResponse updateCurrentTenantBranding(UpdateTenantBrandingRequest request);

    TenantSettingsResponse updateCurrentTenantSettings(UpdateTenantSettingsRequest request);

    TenantLabelsResponse updateCurrentTenantLabels(UpdateTenantLabelsRequest request);

    // 테넌트 코드로 공개 정보 조회 (인증 불필요)
    TenantBrandingResponse getBrandingByCode(String code);

    TenantLabelsResponse getLabelsByCode(String code);

    boolean existsByCode(String code);

    // 공개 테넌트 목록 조회 (회원가입용)
    List<PublicTenantResponse> getPublicActiveTenants();
}
