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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseTermRepository courseTermRepository;
    private final CourseApplicationRepository courseApplicationRepository;
    private final InstructorAssignmentRepository instructorAssignmentRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        // 전체 통계
        long totalUsers = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalTerms = courseTermRepository.count();

        // 강사 수 (USER 역할 중 강사 배정이 있는 사람들)
        List<InstructorAssignment> allAssignments = instructorAssignmentRepository.findAll();
        long totalInstructors = allAssignments.stream()
            .map(InstructorAssignment::getInstructor)
            .map(User::getId)
            .distinct()
            .count();

        // 차수 상태별 통계
        long scheduledTerms = courseTermRepository.findByStatus(TermStatus.SCHEDULED).size();
        long inProgressTerms = courseTermRepository.findByStatus(TermStatus.ONGOING).size();
        long completedTerms = courseTermRepository.findByStatus(TermStatus.COMPLETED).size();
        long cancelledTerms = courseTermRepository.findByStatus(TermStatus.CANCELLED).size();

        // 강의 신청 통계
        long pendingApplications = courseApplicationRepository.findByStatus(ApplicationStatus.PENDING).size();
        long approvedApplications = courseApplicationRepository.findByStatus(ApplicationStatus.APPROVED).size();
        long rejectedApplications = courseApplicationRepository.findByStatus(ApplicationStatus.REJECTED).size();

        // 사용자 역할별 통계
        Map<String, Long> usersByRole = new HashMap<>();
        for (UserRole role : UserRole.values()) {
            long count = userRepository.findAll().stream()
                .filter(u -> u.getRole() == role)
                .count();
            usersByRole.put(role.name(), count);
        }

        // 캘린더용 차수 목록 (예정 + 진행중, 최근 3개월)
        LocalDate today = LocalDate.now();
        LocalDate threeMonthsLater = today.plusMonths(3);

        List<CourseTerm> upcomingTermsList = courseTermRepository.findAll().stream()
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
