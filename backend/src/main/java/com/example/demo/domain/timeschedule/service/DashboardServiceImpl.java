package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.timeschedule.dto.DashboardStatisticsResponse;
import com.example.demo.domain.timeschedule.entity.*;
import com.example.demo.domain.timeschedule.repository.ClassRoomRepository;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.timeschedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final CourseRepository courseRepository;
    private final CourseTermRepository courseTermRepository;
    private final ScheduleRepository scheduleRepository;
    private final ClassRoomRepository classRoomRepository;
    private final InstructorAssignmentRepository assignmentRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public DashboardStatisticsResponse getDashboardStatistics() {
        log.debug("Getting dashboard statistics");

        return new DashboardStatisticsResponse(
            getOverallStatistics(),
            getTodaySchedules(),
            getWeeklyScheduleSummary(),
            getTermStatistics()
        );
    }

    @Override
    public DashboardStatisticsResponse.OverallStatistics getOverallStatistics() {
        long totalCourses = courseRepository.count();
        long totalTerms = courseTermRepository.count();
        long activeTerms = courseTermRepository.countByStatus(TermStatus.ONGOING);
        long totalStudents = enrollmentRepository.count();
        long totalInstructors = assignmentRepository.count();
        long totalClassRooms = classRoomRepository.count();
        long availableClassRooms = classRoomRepository.countByStatus(ClassRoomStatus.AVAILABLE);

        return new DashboardStatisticsResponse.OverallStatistics(
            totalCourses,
            totalTerms,
            activeTerms,
            totalStudents,
            totalInstructors,
            totalClassRooms,
            availableClassRooms
        );
    }

    @Override
    public DashboardStatisticsResponse.TodaySchedules getTodaySchedules() {
        LocalDate today = LocalDate.now();
        List<Schedule> todaySchedules = scheduleRepository.findByDateRangeWithDetails(today, today);

        int totalClasses = todaySchedules.size();
        int cancelledClasses = (int) todaySchedules.stream()
            .filter(s -> s.getScheduleType() == ScheduleType.CANCELLED)
            .count();
        int makeupClasses = (int) todaySchedules.stream()
            .filter(s -> s.getScheduleType() == ScheduleType.MAKEUP)
            .count();

        List<DashboardStatisticsResponse.ScheduleSummary> summaries = todaySchedules.stream()
            .map(this::toScheduleSummary)
            .toList();

        return new DashboardStatisticsResponse.TodaySchedules(
            today,
            totalClasses,
            cancelledClasses,
            makeupClasses,
            summaries
        );
    }

    @Override
    public DashboardStatisticsResponse.WeeklyScheduleSummary getWeeklyScheduleSummary() {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate weekEnd = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        List<Schedule> weekSchedules = scheduleRepository.findByDateRangeWithDetails(weekStart, weekEnd);

        int mondayCount = countByDayOfWeek(weekSchedules, DayOfWeekEnum.MONDAY);
        int tuesdayCount = countByDayOfWeek(weekSchedules, DayOfWeekEnum.TUESDAY);
        int wednesdayCount = countByDayOfWeek(weekSchedules, DayOfWeekEnum.WEDNESDAY);
        int thursdayCount = countByDayOfWeek(weekSchedules, DayOfWeekEnum.THURSDAY);
        int fridayCount = countByDayOfWeek(weekSchedules, DayOfWeekEnum.FRIDAY);
        int saturdayCount = countByDayOfWeek(weekSchedules, DayOfWeekEnum.SATURDAY);
        int sundayCount = countByDayOfWeek(weekSchedules, DayOfWeekEnum.SUNDAY);

        return new DashboardStatisticsResponse.WeeklyScheduleSummary(
            weekStart,
            weekEnd,
            mondayCount,
            tuesdayCount,
            wednesdayCount,
            thursdayCount,
            fridayCount,
            saturdayCount,
            sundayCount,
            weekSchedules.size()
        );
    }

    private List<DashboardStatisticsResponse.TermStatistics> getTermStatistics() {
        List<CourseTerm> activeTerms = courseTermRepository.findByStatusIn(
            List.of(TermStatus.SCHEDULED, TermStatus.ONGOING)
        );

        List<DashboardStatisticsResponse.TermStatistics> termStats = new ArrayList<>();

        for (CourseTerm term : activeTerms) {
            List<Schedule> schedules = scheduleRepository.findByTermId(term.getId());
            LocalDate today = LocalDate.now();

            int totalSchedules = schedules.size();
            int completedSchedules = (int) schedules.stream()
                .filter(s -> s.getScheduleDate().isBefore(today) || s.getScheduleDate().isEqual(today))
                .filter(s -> s.getScheduleType() != ScheduleType.CANCELLED)
                .count();
            int remainingSchedules = totalSchedules - completedSchedules;

            double progressPercent = totalSchedules > 0
                ? Math.round((double) completedSchedules / totalSchedules * 100 * 10) / 10.0
                : 0.0;

            termStats.add(new DashboardStatisticsResponse.TermStatistics(
                term.getId(),
                term.getCourse().getTitle(),
                term.getTermNumber(),
                term.getStatus().name(),
                term.getStartDate(),
                term.getEndDate(),
                term.getCurrentStudents(),
                term.getMaxStudents(),
                totalSchedules,
                completedSchedules,
                remainingSchedules,
                progressPercent
            ));
        }

        return termStats;
    }

    private DashboardStatisticsResponse.ScheduleSummary toScheduleSummary(Schedule schedule) {
        CourseTerm term = schedule.getTerm();

        // 강사 이름 조회
        String instructorName = assignmentRepository.findByTermIdAndStatus(term.getId(), AssignmentStatus.ASSIGNED)
            .stream()
            .findFirst()
            .map(a -> a.getInstructor().getName())
            .orElse(null);

        return new DashboardStatisticsResponse.ScheduleSummary(
            schedule.getId(),
            term.getCourse().getTitle(),
            term.getTermNumber(),
            schedule.getStartTime().toString(),
            schedule.getEndTime().toString(),
            schedule.getClassRoom() != null ? schedule.getClassRoom().getName() : null,
            instructorName,
            schedule.getScheduleType().name()
        );
    }

    private int countByDayOfWeek(List<Schedule> schedules, DayOfWeekEnum dayOfWeek) {
        return (int) schedules.stream()
            .filter(s -> s.getDayOfWeek() == dayOfWeek)
            .count();
    }
}
