package com.example.demo.domain.dashboard.service;

import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.courseapplication.entity.ApplicationStatus;
import com.example.demo.domain.courseapplication.repository.CourseApplicationRepository;
import com.example.demo.domain.dashboard.dto.DashboardStatsResponse;
import com.example.demo.domain.dashboard.dto.DashboardStatsResponse.InstructorStats;
import com.example.demo.domain.dashboard.dto.DashboardStatsResponse.TermCalendarItem;
import com.example.demo.domain.timeschedule.entity.AssignmentStatus;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseTermRepository courseTermRepository;
    private final CourseApplicationRepository courseApplicationRepository;
    private final InstructorAssignmentRepository instructorAssignmentRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        Long tenantId = TenantContext.getTenantId();

        // 전체 통계 (테넌트별 필터링)
        long totalUsers;
        long totalCourses;
        long totalTerms;
        List<InstructorAssignment> allAssignments;
        long scheduledTerms;
        long inProgressTerms;
        long completedTerms;
        long cancelledTerms;
        long pendingApplications;
        long approvedApplications;
        long rejectedApplications;
        List<User> allUsers;
        List<CourseTerm> allTerms;

        if (tenantId != null) {
            totalUsers = userRepository.countByTenantId(tenantId);
            totalCourses = courseRepository.countByTenantId(tenantId);
            totalTerms = courseTermRepository.countByTenantId(tenantId);
            allAssignments = instructorAssignmentRepository.findByTenantId(tenantId);
            scheduledTerms = courseTermRepository.findByTenantIdAndStatus(tenantId, TermStatus.SCHEDULED).size();
            inProgressTerms = courseTermRepository.findByTenantIdAndStatus(tenantId, TermStatus.ONGOING).size();
            completedTerms = courseTermRepository.findByTenantIdAndStatus(tenantId, TermStatus.COMPLETED).size();
            cancelledTerms = courseTermRepository.findByTenantIdAndStatus(tenantId, TermStatus.CANCELLED).size();
            pendingApplications = courseApplicationRepository.findByTenantIdAndStatus(tenantId, ApplicationStatus.PENDING).size();
            approvedApplications = courseApplicationRepository.findByTenantIdAndStatus(tenantId, ApplicationStatus.APPROVED).size();
            rejectedApplications = courseApplicationRepository.findByTenantIdAndStatus(tenantId, ApplicationStatus.REJECTED).size();
            allUsers = userRepository.findByTenantId(tenantId);
            allTerms = courseTermRepository.findByTenantId(tenantId);
        } else {
            totalUsers = userRepository.count();
            totalCourses = courseRepository.count();
            totalTerms = courseTermRepository.count();
            allAssignments = instructorAssignmentRepository.findAll();
            scheduledTerms = courseTermRepository.findByStatus(TermStatus.SCHEDULED).size();
            inProgressTerms = courseTermRepository.findByStatus(TermStatus.ONGOING).size();
            completedTerms = courseTermRepository.findByStatus(TermStatus.COMPLETED).size();
            cancelledTerms = courseTermRepository.findByStatus(TermStatus.CANCELLED).size();
            pendingApplications = courseApplicationRepository.findByStatus(ApplicationStatus.PENDING).size();
            approvedApplications = courseApplicationRepository.findByStatus(ApplicationStatus.APPROVED).size();
            rejectedApplications = courseApplicationRepository.findByStatus(ApplicationStatus.REJECTED).size();
            allUsers = userRepository.findAll();
            allTerms = courseTermRepository.findAll();
        }

        // 강사 수 (배정된 강사들)
        long totalInstructors = allAssignments.stream()
            .map(InstructorAssignment::getInstructor)
            .map(User::getId)
            .distinct()
            .count();

        // Operator 대시보드용: TENANT_ADMIN, SUPER_ADMIN 제외
        List<User> filteredUsers = allUsers.stream()
            .filter(u -> u.getRole() != UserRole.TENANT_ADMIN && u.getRole() != UserRole.SUPER_ADMIN)
            .toList();

        // totalUsers도 관리자 제외한 수로 재계산
        totalUsers = filteredUsers.size();

        // 사용자 역할별 통계 (TENANT_ADMIN, SUPER_ADMIN 제외)
        Map<String, Long> usersByRole = new HashMap<>();
        for (UserRole role : UserRole.values()) {
            // TENANT_ADMIN, SUPER_ADMIN은 통계에서 제외
            if (role == UserRole.TENANT_ADMIN || role == UserRole.SUPER_ADMIN) {
                continue;
            }
            long count = filteredUsers.stream()
                .filter(u -> u.getRole() == role)
                .count();
            usersByRole.put(role.name(), count);
        }

        // 캘린더용 차수 목록 (예정 + 진행중)
        LocalDate today = LocalDate.now();

        List<CourseTerm> upcomingTermsList = allTerms.stream()
            .filter(term -> term.getStatus() == TermStatus.SCHEDULED || term.getStatus() == TermStatus.ONGOING)
            .filter(term -> !term.getEndDate().isBefore(today))
            .sorted(Comparator.comparing(CourseTerm::getStartDate))
            .limit(20)
            .toList();

        List<TermCalendarItem> upcomingTerms = upcomingTermsList.stream()
            .map(term -> {
                // 해당 차수에 배정된 강사 찾기
                String instructorName = instructorAssignmentRepository.findByTerm(term).stream()
                    .filter(a -> a.getStatus() == AssignmentStatus.ASSIGNED)
                    .findFirst()
                    .map(a -> a.getInstructor().getName())
                    .orElse(null);

                return new TermCalendarItem(
                    term.getId(),
                    term.getCourse().getTitle(),
                    term.getTermNumber(),
                    term.getStartDate().toString(),
                    term.getEndDate().toString(),
                    term.getDaysOfWeek().stream().map(Enum::name).toList(),
                    term.getStartTime().toString(),
                    term.getEndTime().toString(),
                    term.getStatus().name(),
                    term.getCurrentStudents(),
                    term.getMaxStudents(),
                    instructorName
                );
            })
            .toList();

        // 강사별 배정 현황
        Map<Long, List<InstructorAssignment>> assignmentsByInstructor = allAssignments.stream()
            .filter(a -> a.getStatus() == AssignmentStatus.ASSIGNED)
            .collect(Collectors.groupingBy(a -> a.getInstructor().getId()));

        List<InstructorStats> instructorStats = assignmentsByInstructor.entrySet().stream()
            .map(entry -> {
                User instructor = entry.getValue().get(0).getInstructor();
                List<InstructorAssignment> assignments = entry.getValue();

                long assigned = assignments.size();
                long inProgress = assignments.stream()
                    .filter(a -> a.getTerm().getStatus() == TermStatus.ONGOING)
                    .count();
                long completed = assignments.stream()
                    .filter(a -> a.getTerm().getStatus() == TermStatus.COMPLETED)
                    .count();

                return new InstructorStats(
                    instructor.getId(),
                    instructor.getName(),
                    assigned,
                    inProgress,
                    completed
                );
            })
            .sorted(Comparator.comparing(InstructorStats::assignedTerms).reversed())
            .limit(10)
            .toList();

        return new DashboardStatsResponse(
            totalUsers,
            totalCourses,
            totalTerms,
            totalInstructors,
            scheduledTerms,
            inProgressTerms,
            completedTerms,
            cancelledTerms,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            usersByRole,
            upcomingTerms,
            instructorStats
        );
    }
}
