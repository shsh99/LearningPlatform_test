package com.example.demo.domain.dashboard.service;

import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.dashboard.dto.SuperAdminDashboardResponse;
import com.example.demo.domain.dashboard.dto.SuperAdminDashboardResponse.TenantStats;
import com.example.demo.domain.dashboard.dto.SuperAdminDashboardResponse.TotalStats;
import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.repository.TenantRepository;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class SuperAdminDashboardServiceImpl implements SuperAdminDashboardService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseTermRepository courseTermRepository;

    @Override
    public SuperAdminDashboardResponse getDashboardStats() {
        // 모든 테넌트 조회 (default 제외)
        List<Tenant> tenants = tenantRepository.findAll().stream()
                .filter(t -> !"default".equals(t.getCode()))
                .toList();

        // 테넌트별 통계 수집
        List<TenantStats> tenantStatsList = new ArrayList<>();
        long totalUsers = 0;
        long totalCourses = 0;
        long totalUsageMinutes = 0;

        for (Tenant tenant : tenants) {
            Long tenantId = tenant.getId();

            long userCount = userRepository.countByTenantId(tenantId);
            long courseCount = courseRepository.countByTenantId(tenantId);
            long termCount = courseTermRepository.countByTenantId(tenantId);

            // TODO: 실제 평점 및 사용량 데이터 연동 필요 (현재는 더미값)
            double averageRating = 4.0 + (Math.random() * 1.0); // 4.0 ~ 5.0 사이 더미값
            long usageMinutes = (long) (userCount * 120 + Math.random() * 500); // 더미 사용량

            TenantStats stats = new TenantStats(
                    tenantId,
                    tenant.getCode(),
                    tenant.getName(),
                    tenant.getStatus().name(),
                    userCount,
                    courseCount,
                    termCount,
                    Math.round(averageRating * 10) / 10.0,
                    usageMinutes
            );
            tenantStatsList.add(stats);

            totalUsers += userCount;
            totalCourses += courseCount;
            totalUsageMinutes += usageMinutes;
        }

        // 전체 통계
        long totalTenants = tenants.size();
        double totalAverageRating = tenantStatsList.isEmpty() ? 0 :
                tenantStatsList.stream()
                        .mapToDouble(TenantStats::averageRating)
                        .average()
                        .orElse(0);

        TotalStats totalStats = new TotalStats(
                totalTenants,
                totalUsers,
                totalCourses,
                Math.round(totalAverageRating * 10) / 10.0,
                totalUsageMinutes
        );

        return new SuperAdminDashboardResponse(totalStats, tenantStatsList);
    }
}
