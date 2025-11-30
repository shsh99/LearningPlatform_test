package com.example.demo.domain.tenant.controller;

import com.example.demo.domain.tenant.dto.*;
import com.example.demo.domain.tenant.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 테넌트 관리 API (SUPER_ADMIN 전용)
 */
@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
@Validated
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public ResponseEntity<TenantResponse> createTenant(@Valid @RequestBody CreateTenantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tenantService.createTenant(request));
    }

    @GetMapping
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @GetMapping("/active")
    public ResponseEntity<List<TenantResponse>> getActiveTenants() {
        return ResponseEntity.ok(tenantService.getActiveTenants());
    }

    @GetMapping("/{tenantId}")
    public ResponseEntity<TenantDetailResponse> getTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(tenantService.getTenant(tenantId));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<TenantDetailResponse> getTenantByCode(@PathVariable String code) {
        return ResponseEntity.ok(tenantService.getTenantByCode(code));
    }

    @PutMapping("/{tenantId}")
    public ResponseEntity<TenantResponse> updateTenant(
            @PathVariable Long tenantId,
            @Valid @RequestBody UpdateTenantRequest request
    ) {
        return ResponseEntity.ok(tenantService.updateTenant(tenantId, request));
    }

    @DeleteMapping("/{tenantId}")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long tenantId) {
        tenantService.deleteTenant(tenantId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{tenantId}/activate")
    public ResponseEntity<Void> activateTenant(@PathVariable Long tenantId) {
        tenantService.activateTenant(tenantId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{tenantId}/deactivate")
    public ResponseEntity<Void> deactivateTenant(@PathVariable Long tenantId) {
        tenantService.deactivateTenant(tenantId);
        return ResponseEntity.ok().build();
    }

    // 브랜딩 관리
    @GetMapping("/{tenantId}/branding")
    public ResponseEntity<TenantBrandingResponse> getBranding(@PathVariable Long tenantId) {
        return ResponseEntity.ok(tenantService.getBranding(tenantId));
    }

    @PutMapping("/{tenantId}/branding")
    public ResponseEntity<TenantBrandingResponse> updateBranding(
            @PathVariable Long tenantId,
            @Valid @RequestBody UpdateTenantBrandingRequest request
    ) {
        return ResponseEntity.ok(tenantService.updateBranding(tenantId, request));
    }

    // 설정 관리
    @GetMapping("/{tenantId}/settings")
    public ResponseEntity<TenantSettingsResponse> getSettings(@PathVariable Long tenantId) {
        return ResponseEntity.ok(tenantService.getSettings(tenantId));
    }

    @PutMapping("/{tenantId}/settings")
    public ResponseEntity<TenantSettingsResponse> updateSettings(
            @PathVariable Long tenantId,
            @Valid @RequestBody UpdateTenantSettingsRequest request
    ) {
        return ResponseEntity.ok(tenantService.updateSettings(tenantId, request));
    }

    // 라벨 관리
    @GetMapping("/{tenantId}/labels")
    public ResponseEntity<TenantLabelsResponse> getLabels(@PathVariable Long tenantId) {
        return ResponseEntity.ok(tenantService.getLabels(tenantId));
    }

    @PutMapping("/{tenantId}/labels")
    public ResponseEntity<TenantLabelsResponse> updateLabels(
            @PathVariable Long tenantId,
            @Valid @RequestBody UpdateTenantLabelsRequest request
    ) {
        return ResponseEntity.ok(tenantService.updateLabels(tenantId, request));
    }
}
