package com.example.demo.domain.tenant.controller;

import com.example.demo.domain.tenant.dto.TenantBrandingResponse;
import com.example.demo.domain.tenant.dto.TenantLabelsResponse;
import com.example.demo.domain.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 테넌트 공개 API (인증 불필요)
 * URL 기반 테넌트 접근 시 브랜딩/라벨 정보 제공
 */
@RestController
@RequestMapping("/api/public/tenant")
@RequiredArgsConstructor
public class PublicTenantController {

    private final TenantService tenantService;

    /**
     * 테넌트 코드로 브랜딩 정보 조회
     * 로그인 페이지에서 테넌트별 테마 적용에 사용
     */
    @GetMapping("/{code}/branding")
    public ResponseEntity<TenantBrandingResponse> getBrandingByCode(@PathVariable String code) {
        return ResponseEntity.ok(tenantService.getBrandingByCode(code));
    }

    /**
     * 테넌트 코드로 라벨 정보 조회
     * 로그인 페이지에서 테넌트별 라벨 적용에 사용
     */
    @GetMapping("/{code}/labels")
    public ResponseEntity<TenantLabelsResponse> getLabelsByCode(@PathVariable String code) {
        return ResponseEntity.ok(tenantService.getLabelsByCode(code));
    }

    /**
     * 테넌트 코드 존재 여부 확인
     * URL 유효성 검증에 사용
     */
    @GetMapping("/{code}/exists")
    public ResponseEntity<Boolean> existsByCode(@PathVariable String code) {
        return ResponseEntity.ok(tenantService.existsByCode(code));
    }
}
