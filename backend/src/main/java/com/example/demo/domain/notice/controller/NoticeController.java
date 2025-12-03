package com.example.demo.domain.notice.controller;

import com.example.demo.domain.notice.dto.CreateNoticeRequest;
import com.example.demo.domain.notice.dto.NoticeResponse;
import com.example.demo.domain.notice.dto.UpdateNoticeRequest;
import com.example.demo.domain.notice.service.NoticeService;
import com.example.demo.global.security.JwtTokenProvider;
import com.example.demo.global.tenant.TenantContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 공지 REST API Controller
 */
@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@Validated
public class NoticeController {

    private final NoticeService noticeService;
    private final JwtTokenProvider jwtTokenProvider;

    // ==================== 관리자 API ====================

    /**
     * 공지 생성
     * POST /api/notices
     * 권한: SUPER_ADMIN (시스템 공지), TENANT_ADMIN (테넌트 공지)
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<NoticeResponse> createNotice(
            @Valid @RequestBody CreateNoticeRequest request,
            HttpServletRequest httpRequest
    ) {
        Long createdBy = getUserIdFromToken(httpRequest);
        NoticeResponse response = noticeService.create(request, createdBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 공지 단건 조회
     * GET /api/notices/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponse> getNoticeById(
            @PathVariable @Positive Long id
    ) {
        NoticeResponse response = noticeService.findById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 시스템 공지 목록 조회 (SUPER_ADMIN 관리용)
     * GET /api/notices/system
     */
    @GetMapping("/system")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<NoticeResponse>> getSystemNotices(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<NoticeResponse> response = noticeService.findSystemNotices(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 테넌트 공지 목록 조회 (TENANT_ADMIN 관리용)
     * GET /api/notices/tenant
     */
    @GetMapping("/tenant")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<Page<NoticeResponse>> getTenantNotices(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Long tenantId = TenantContext.getTenantId();
        Page<NoticeResponse> response = noticeService.findTenantNotices(tenantId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 공지 수정
     * PATCH /api/notices/{id}
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<NoticeResponse> updateNotice(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UpdateNoticeRequest request
    ) {
        NoticeResponse response = noticeService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 공지 활성화
     * POST /api/notices/{id}/enable
     */
    @PostMapping("/{id}/enable")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<NoticeResponse> enableNotice(
            @PathVariable @Positive Long id
    ) {
        NoticeResponse response = noticeService.enable(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 공지 비활성화
     * POST /api/notices/{id}/disable
     */
    @PostMapping("/{id}/disable")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<NoticeResponse> disableNotice(
            @PathVariable @Positive Long id
    ) {
        NoticeResponse response = noticeService.disable(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 공지 삭제
     * DELETE /api/notices/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<Void> deleteNotice(
            @PathVariable @Positive Long id
    ) {
        noticeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== 사용자 API (활성 공지 조회) ====================

    /**
     * 현재 활성화된 시스템 공지 조회 (TENANT_ADMIN에게 표시)
     * GET /api/notices/active/system
     */
    @GetMapping("/active/system")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<List<NoticeResponse>> getActiveSystemNotices() {
        List<NoticeResponse> response = noticeService.findActiveSystemNotices();
        return ResponseEntity.ok(response);
    }

    /**
     * 현재 활성화된 테넌트 공지 조회 (테넌트 사용자에게 표시)
     * GET /api/notices/active/tenant
     */
    @GetMapping("/active/tenant")
    public ResponseEntity<List<NoticeResponse>> getActiveTenantNotices() {
        Long tenantId = TenantContext.getTenantId();
        List<NoticeResponse> response = noticeService.findActiveTenantNotices(tenantId);
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
