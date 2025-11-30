package com.example.demo.domain.tenantapplication.controller;

import com.example.demo.domain.tenantapplication.dto.*;
import com.example.demo.domain.tenantapplication.entity.ApplicationStatus;
import com.example.demo.domain.tenantapplication.service.TenantApplicationService;
import com.example.demo.global.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 테넌트 신청 관리 API
 * - 비회원: 신청 생성
 * - SUPER_ADMIN: 신청 목록 조회, 승인/거절
 */
@RestController
@RequestMapping("/api/tenant-applications")
@RequiredArgsConstructor
public class TenantApplicationController {

    private final TenantApplicationService tenantApplicationService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 테넌트 신청 생성 (비회원)
     * POST /api/tenant-applications
     * 권한: 인증 불필요
     */
    @PostMapping
    public ResponseEntity<TenantApplicationResponse> createApplication(
            @Valid @RequestBody CreateTenantApplicationRequest request
    ) {
        TenantApplicationResponse response = tenantApplicationService.createApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 모든 신청 목록 조회 (SUPER_ADMIN)
     * GET /api/tenant-applications
     * 권한: SUPER_ADMIN만 가능
     */
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<TenantApplicationResponse>> getAllApplications() {
        List<TenantApplicationResponse> responses = tenantApplicationService.getAllApplications();
        return ResponseEntity.ok(responses);
    }

    /**
     * 대기 중인 신청 목록 조회 (SUPER_ADMIN)
     * GET /api/tenant-applications/pending
     * 권한: SUPER_ADMIN만 가능
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<TenantApplicationResponse>> getPendingApplications() {
        List<TenantApplicationResponse> responses = tenantApplicationService.getPendingApplications();
        return ResponseEntity.ok(responses);
    }

    /**
     * 상태별 신청 목록 조회 (SUPER_ADMIN)
     * GET /api/tenant-applications/status/{status}
     * 권한: SUPER_ADMIN만 가능
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<TenantApplicationResponse>> getApplicationsByStatus(
            @PathVariable ApplicationStatus status
    ) {
        List<TenantApplicationResponse> responses = tenantApplicationService.getApplicationsByStatus(status);
        return ResponseEntity.ok(responses);
    }

    /**
     * 신청 상세 조회 (SUPER_ADMIN)
     * GET /api/tenant-applications/{id}
     * 권한: SUPER_ADMIN만 가능
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantApplicationResponse> getApplication(@PathVariable Long id) {
        TenantApplicationResponse response = tenantApplicationService.getApplication(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 신청 승인 (SUPER_ADMIN)
     * POST /api/tenant-applications/{id}/approve
     * 권한: SUPER_ADMIN만 가능
     * 승인 시 테넌트 + 테넌트 어드민 자동 생성
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantApplicationResponse> approveApplication(
            @PathVariable Long id,
            @Valid @RequestBody ApproveApplicationRequest request,
            HttpServletRequest httpRequest
    ) {
        Long adminId = getUserIdFromToken(httpRequest);
        TenantApplicationResponse response = tenantApplicationService.approveApplication(id, request, adminId);
        return ResponseEntity.ok(response);
    }

    /**
     * 신청 거절 (SUPER_ADMIN)
     * POST /api/tenant-applications/{id}/reject
     * 권한: SUPER_ADMIN만 가능
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantApplicationResponse> rejectApplication(
            @PathVariable Long id,
            @Valid @RequestBody RejectApplicationRequest request,
            HttpServletRequest httpRequest
    ) {
        Long adminId = getUserIdFromToken(httpRequest);
        TenantApplicationResponse response = tenantApplicationService.rejectApplication(id, request, adminId);
        return ResponseEntity.ok(response);
    }

    /**
     * 토큰에서 사용자 ID 추출
     */
    private Long getUserIdFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
