package com.example.demo.domain.dashboard.controller;

import com.example.demo.domain.dashboard.dto.TenantAdminDashboardResponse;
import com.example.demo.domain.dashboard.service.TenantAdminDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tenant-admin/dashboard")
@RequiredArgsConstructor
@Validated
@Slf4j
public class TenantAdminDashboardController {

    private final TenantAdminDashboardService tenantAdminDashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<TenantAdminDashboardResponse> getDashboardStats() {
        log.info("TenantAdmin dashboard stats requested");
        TenantAdminDashboardResponse stats = tenantAdminDashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
