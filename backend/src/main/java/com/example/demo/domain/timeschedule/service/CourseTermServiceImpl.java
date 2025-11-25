package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.DayOfWeekEnum;
import com.example.demo.domain.timeschedule.entity.Schedule;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.ScheduleRepository;
import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CourseTermServiceImpl implements CourseTermService {

    private final CourseTermRepository courseTermRepository;
    private final CourseRepository courseRepository;
    private final ScheduleRepository scheduleRepository;

    @Override
    @Transactional
    public CourseTermResponse createTerm(CreateCourseTermRequest request) {
        log.info("Creating course term: courseId={}, termNumber={}", request.courseId(), request.termNumber());

        // 1. Course 조회
        Course course = courseRepository.findById(request.courseId())
            .orElseThrow(() -> new NotFoundException(ErrorCode.COURSE_NOT_FOUND, "강의 ID: " + request.courseId()));

        // 2. 날짜 검증
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("종료일은 시작일 이후여야 합니다");
        }

        // 3. Entity 생성 및 저장
        CourseTerm term = CourseTerm.create(
            course,
            request.termNumber(),
            request.startDate(),
            request.endDate(),
            request.maxStudents()
        );

        CourseTerm savedTerm = courseTermRepository.save(term);

        // 4. 주차별 스케줄 자동 생성 (weeklySchedules가 제공된 경우)
        if (request.weeklySchedules() != null && !request.weeklySchedules().isEmpty()) {
            List<Schedule> generatedSchedules = generateWeeklySchedules(savedTerm, request);
            scheduleRepository.saveAll(generatedSchedules);
            log.info("Generated {} schedules for term id={}", generatedSchedules.size(), savedTerm.getId());
        }

        log.info("Course term created: id={}", savedTerm.getId());

        return CourseTermResponse.from(savedTerm);
    }

    /**
     * 차수 기간 동안 주차별 스케줄 자동 생성
     */
    private List<Schedule> generateWeeklySchedules(CourseTerm term, CreateCourseTermRequest request) {
        List<Schedule> schedules = new ArrayList<>();
        LocalDate startDate = term.getStartDate();
        LocalDate endDate = term.getEndDate();

        for (CreateCourseTermRequest.WeeklyScheduleInfo weeklyInfo : request.weeklySchedules()) {
            DayOfWeekEnum dayOfWeekEnum = DayOfWeekEnum.valueOf(weeklyInfo.dayOfWeek());
            DayOfWeek targetDayOfWeek = convertToDayOfWeek(dayOfWeekEnum);

            // 시작일부터 해당 요일의 첫 번째 날짜 찾기
            LocalDate firstScheduleDate = startDate;
            while (firstScheduleDate.getDayOfWeek() != targetDayOfWeek) {
                firstScheduleDate = firstScheduleDate.plusDays(1);
                if (firstScheduleDate.isAfter(endDate)) {
                    break;
                }
            }

            // 해당 요일에 대해 매주 스케줄 생성
            LocalDate currentDate = firstScheduleDate;
            int weekNumber = 1;

            while (!currentDate.isAfter(endDate)) {
                Schedule schedule = Schedule.create(
                    term,
                    weekNumber,
                    dayOfWeekEnum,
                    currentDate,
                    weeklyInfo.startTime(),
                    weeklyInfo.endTime()
                );
                schedules.add(schedule);

                currentDate = currentDate.plusWeeks(1);
                weekNumber++;
            }
        }

        return schedules;
    }

    /**
     * DayOfWeekEnum을 java.time.DayOfWeek로 변환
     */
    private DayOfWeek convertToDayOfWeek(DayOfWeekEnum dayOfWeekEnum) {
        return switch (dayOfWeekEnum) {
            case MONDAY -> DayOfWeek.MONDAY;
            case TUESDAY -> DayOfWeek.TUESDAY;
            case WEDNESDAY -> DayOfWeek.WEDNESDAY;
            case THURSDAY -> DayOfWeek.THURSDAY;
            case FRIDAY -> DayOfWeek.FRIDAY;
            case SATURDAY -> DayOfWeek.SATURDAY;
            case SUNDAY -> DayOfWeek.SUNDAY;
        };
    }

    @Override
    public CourseTermResponse findById(Long id) {
        log.debug("Finding course term: id={}", id);

        CourseTerm term = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        return CourseTermResponse.from(term);
    }

    @Override
    public List<CourseTermResponse> findByCourseId(Long courseId) {
        log.debug("Finding course terms by courseId: {}", courseId);

        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.COURSE_NOT_FOUND, "강의 ID: " + courseId));

        return courseTermRepository.findByCourse(course).stream()
            .map(CourseTermResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseTermResponse> findAll() {
        log.debug("Finding all course terms");

        return courseTermRepository.findAll().stream()
            .map(CourseTermResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void startTerm(Long id) {
        log.info("Starting course term: id={}", id);

        CourseTerm term = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        term.start();

        log.info("Course term started: id={}", id);
    }

    @Override
    @Transactional
    public void completeTerm(Long id) {
        log.info("Completing course term: id={}", id);

        CourseTerm term = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        term.complete();

        log.info("Course term completed: id={}", id);
    }

    @Override
    @Transactional
    public void cancelTerm(Long id) {
        log.info("Cancelling course term: id={}", id);

        CourseTerm term = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        term.cancel();

        log.info("Course term cancelled: id={}", id);
    }
}
