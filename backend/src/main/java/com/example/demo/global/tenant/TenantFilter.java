package com.example.demo.global.tenant;

import com.example.demo.domain.tenant.repository.TenantRepository;
import jakarta.persistence.EntityManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 요청에서 테넌트 정보를 추출하여 TenantContext에 설정하고 Hibernate 필터를 활성화하는 필터
 *
 * 테넌트 식별 방법 (우선순위):
 * 1. X-Tenant-ID 헤더
 * 2. 서브도메인 (예: samsung.learning.com → samsung)
 * 3. 기본 테넌트 (개발/테스트 환경)
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class TenantFilter extends OncePerRequestFilter {

    private static final String TENANT_HEADER = "X-Tenant-ID";
    private static final Long DEFAULT_TENANT_ID = 1L;  // 개발 환경 기본 테넌트

    private final TenantRepository tenantRepository;
    private final EntityManager entityManager;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            Long tenantId = resolveTenantId(request);
            TenantContext.setTenantId(tenantId);

            // SUPER_ADMIN 확인: SUPER_ADMIN은 필터를 활성화하지 않음 (모든 테넌트 접근 가능)
            if (!isSuperAdmin()) {
                // 일반 사용자: Hibernate Session에서 tenantFilter 활성화
                Session session = entityManager.unwrap(Session.class);
                session.enableFilter("tenantFilter").setParameter("tenantId", tenantId);
                log.debug("Tenant resolved and filter enabled: {}", tenantId);
            } else {
                log.debug("SUPER_ADMIN detected. Tenant filter NOT enabled. Full access granted.");
            }

            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * 현재 사용자가 SUPER_ADMIN인지 확인
     */
    private boolean isSuperAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority ->
                        grantedAuthority.getAuthority().equals("ROLE_SUPER_ADMIN"));
    }

    private Long resolveTenantId(HttpServletRequest request) {
        // 1. X-Tenant-ID 헤더 확인
        String tenantHeader = request.getHeader(TENANT_HEADER);
        if (tenantHeader != null && !tenantHeader.isBlank()) {
            try {
                Long tenantId = Long.parseLong(tenantHeader);
                if (tenantRepository.existsById(tenantId)) {
                    return tenantId;
                }
                log.warn("Invalid tenant ID in header: {}", tenantHeader);
            } catch (NumberFormatException e) {
                // 헤더가 코드일 수 있음 (예: "samsung")
                return tenantRepository.findByCode(tenantHeader)
                        .map(tenant -> tenant.getId())
                        .orElse(DEFAULT_TENANT_ID);
            }
        }

        // 2. 서브도메인 확인
        String host = request.getServerName();
        if (host != null && !host.equals("localhost")) {
            String subdomain = extractSubdomain(host);
            if (subdomain != null) {
                return tenantRepository.findByCode(subdomain)
                        .map(tenant -> tenant.getId())
                        .orElse(DEFAULT_TENANT_ID);
            }
        }

        // 3. 기본 테넌트 반환
        return DEFAULT_TENANT_ID;
    }

    private String extractSubdomain(String host) {
        // 예: samsung.learning.com → samsung
        String[] parts = host.split("\\.");
        if (parts.length >= 3) {
            return parts[0];
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // 정적 리소스나 특정 경로는 필터 제외
        return path.startsWith("/actuator")
                || path.startsWith("/swagger")
                || path.startsWith("/v3/api-docs");
    }
}
