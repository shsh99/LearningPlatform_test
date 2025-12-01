package com.example.demo.domain.dashboard.controller;

import com.example.demo.domain.dashboard.dto.SuperAdminDashboardResponse;
import com.example.demo.domain.dashboard.service.SuperAdminDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/super-admin/dashboard")
@RequiredArgsConstructor
@Validated
@Slf4j
public class SuperAdminDashboardController {

    private final SuperAdminDashboardService superAdminDashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SuperAdminDashboardResponse> getDashboardStats() {
        log.info("SuperAdmin dashboard stats requested");
        SuperAdminDashboardResponse stats = superAdminDashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
