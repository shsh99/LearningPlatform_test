package com.example.demo.domain.dashboard.service;

import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.dashboard.dto.TenantAdminDashboardResponse;
import com.example.demo.domain.dashboard.dto.TenantAdminDashboardResponse.Stats;
import com.example.demo.domain.dashboard.dto.TenantAdminDashboardResponse.TenantInfo;
import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.repository.TenantRepository;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class TenantAdminDashboardServiceImpl implements TenantAdminDashboardService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseTermRepository courseTermRepository;

    @Override
    public TenantAdminDashboardResponse getDashboardStats() {
        Long tenantId = TenantContext.getTenantId();

        if (tenantId == null) {
            throw new IllegalStateException("Tenant ID is required for TenantAdmin dashboard");
        }

        // 테넌트 정보 조회
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalStateException("Tenant not found: " + tenantId));

        TenantInfo tenantInfo = new TenantInfo(
                tenant.getId(),
                tenant.getCode(),
                tenant.getName(),
                tenant.getStatus().name()
        );

        // 통계 수집
        long userCount = userRepository.countByTenantId(tenantId);
        long courseCount = courseRepository.countByTenantId(tenantId);
        long termCount = courseTermRepository.countByTenantId(tenantId);

        // OPERATOR 수 조회
        long operatorCount = userRepository.findByTenantIdAndRole(tenantId, UserRole.OPERATOR).size();

        // TODO: 실제 평점 및 사용량 데이터 연동 필요 (현재는 더미값)
        double averageRating = 4.0 + (Math.random() * 1.0);
        long usageMinutes = (long) (userCount * 120 + Math.random() * 500);

        Stats stats = new Stats(
                userCount,
                courseCount,
                termCount,
                operatorCount,
                Math.round(averageRating * 10) / 10.0,
                usageMinutes
        );

        return new TenantAdminDashboardResponse(tenantInfo, stats);
    }
}
