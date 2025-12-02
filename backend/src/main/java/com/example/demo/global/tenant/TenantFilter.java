package com.example.demo.global.tenant;

import com.example.demo.domain.tenant.repository.TenantRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.security.JwtTokenProvider;
import jakarta.persistence.EntityManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

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
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            // JWT에서 사용자 정보 추출
            Optional<User> userOpt = extractUserFromJwt(request);

            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // SUPER_ADMIN은 모든 테넌트 접근 가능 (tenantId = null)
                if (user.getRole() == UserRole.SUPER_ADMIN) {
                    TenantContext.setTenantId(null);

                    // 크로스 테넌트 접근 감시 로깅
                    String targetTenant = request.getHeader(TENANT_HEADER);
                    if (targetTenant != null && !targetTenant.isBlank()) {
                        log.warn("SUPER_ADMIN cross-tenant access: userId={}, email={}, targetTenant={}, uri={}, method={}",
                                user.getId(), user.getEmail(), targetTenant,
                                request.getRequestURI(), request.getMethod());
                    } else {
                        log.debug("SUPER_ADMIN detected. Tenant filter NOT enabled. Full access granted.");
                    }
                } else {
                    // 로그인한 사용자의 tenantId 사용
                    Long tenantId = user.getTenantId();
                    TenantContext.setTenantId(tenantId);

                    if (tenantId != null) {
                        Session session = entityManager.unwrap(Session.class);
                        session.enableFilter("tenantFilter").setParameter("tenantId", tenantId);
                        log.debug("User tenant resolved and filter enabled: userId={}, tenantId={}", user.getId(), tenantId);
                    }
                }
            } else {
                // 비로그인 요청: 기존 로직 (헤더/서브도메인에서 테넌트 추출)
                Long tenantId = resolveTenantIdFromRequest(request);
                TenantContext.setTenantId(tenantId);

                if (tenantId != null) {
                    Session session = entityManager.unwrap(Session.class);
                    session.enableFilter("tenantFilter").setParameter("tenantId", tenantId);
                    log.debug("Request tenant resolved and filter enabled: {}", tenantId);
                }
            }

            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * JWT에서 사용자 정보 추출
     */
    private Optional<User> extractUserFromJwt(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                String email = jwtTokenProvider.getEmailFromToken(token);
                return userRepository.findActiveUserByEmail(email);
            } catch (Exception e) {
                log.debug("Failed to extract user from JWT: {}", e.getMessage());
            }
        }
        return Optional.empty();
    }

    /**
     * Authorization 헤더에서 토큰 추출
     */
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private Long resolveTenantIdFromRequest(HttpServletRequest request) {
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
