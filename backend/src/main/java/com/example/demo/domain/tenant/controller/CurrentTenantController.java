package com.example.demo.domain.tenant.controller;

import com.example.demo.domain.tenant.dto.*;
import com.example.demo.domain.tenant.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 현재 테넌트 정보 조회/수정 API
 * TenantContext 기반으로 현재 요청의 테넌트 정보를 처리
 */
@RestController
@RequestMapping("/api/tenant")
@RequiredArgsConstructor
@Validated
public class CurrentTenantController {

    private final TenantService tenantService;

    /**
     * 현재 테넌트 전체 정보 조회
     */
    @GetMapping
    public ResponseEntity<TenantDetailResponse> getCurrentTenant() {
        return ResponseEntity.ok(tenantService.getCurrentTenant());
    }

    /**
     * 현재 테넌트 브랜딩 정보 조회 (CSS 변수 적용용)
     */
    @GetMapping("/branding")
    public ResponseEntity<TenantBrandingResponse> getCurrentTenantBranding() {
        return ResponseEntity.ok(tenantService.getCurrentTenantBranding());
    }

    /**
     * 현재 테넌트 설정 정보 조회 (기능 ON/OFF, 메뉴 가시성 등)
     */
    @GetMapping("/settings")
    public ResponseEntity<TenantSettingsResponse> getCurrentTenantSettings() {
        return ResponseEntity.ok(tenantService.getCurrentTenantSettings());
    }

    /**
     * 현재 테넌트 라벨 정보 조회 (강의→교육과정 등 커스텀 라벨)
     */
    @GetMapping("/labels")
    public ResponseEntity<TenantLabelsResponse> getCurrentTenantLabels() {
        return ResponseEntity.ok(tenantService.getCurrentTenantLabels());
    }

    /**
     * 현재 테넌트 브랜딩 업데이트 (TENANT_ADMIN 전용)
     * PUT /api/tenant/branding
     * 권한: TENANT_ADMIN만 자신의 테넌트 브랜딩 수정 가능
     */
    @PutMapping("/branding")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<TenantBrandingResponse> updateCurrentTenantBranding(
            @Valid @RequestBody UpdateTenantBrandingRequest request) {
        return ResponseEntity.ok(tenantService.updateCurrentTenantBranding(request));
    }

    /**
     * 현재 테넌트 설정 업데이트 (TENANT_ADMIN 전용)
     * PUT /api/tenant/settings
     * 권한: TENANT_ADMIN만 자신의 테넌트 설정 수정 가능
     */
    @PutMapping("/settings")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<TenantSettingsResponse> updateCurrentTenantSettings(
            @Valid @RequestBody UpdateTenantSettingsRequest request) {
        return ResponseEntity.ok(tenantService.updateCurrentTenantSettings(request));
    }

    /**
     * 현재 테넌트 라벨 업데이트 (TENANT_ADMIN 전용)
     * PUT /api/tenant/labels
     * 권한: TENANT_ADMIN만 자신의 테넌트 라벨 수정 가능
     */
    @PutMapping("/labels")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<TenantLabelsResponse> updateCurrentTenantLabels(
            @Valid @RequestBody UpdateTenantLabelsRequest request) {
        return ResponseEntity.ok(tenantService.updateCurrentTenantLabels(request));
    }
}
