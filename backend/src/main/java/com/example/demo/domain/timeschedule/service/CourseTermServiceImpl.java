package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;
import com.example.demo.domain.timeschedule.dto.UpdateCourseTermRequest;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CourseTermServiceImpl implements CourseTermService {

    private final CourseTermRepository courseTermRepository;
    private final CourseRepository courseRepository;

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

        // 3. 시간 검증
        if (request.endTime().isBefore(request.startTime()) || request.endTime().equals(request.startTime())) {
            throw new IllegalArgumentException("종료 시간은 시작 시간 이후여야 합니다");
        }

        // 4. Entity 생성 및 저장
        CourseTerm term = CourseTerm.create(
            course,
            request.termNumber(),
            request.startDate(),
            request.endDate(),
            request.daysOfWeek(),
            request.startTime(),
            request.endTime(),
            request.maxStudents()
        );

        CourseTerm savedTerm = courseTermRepository.save(term);

        log.info("Course term created: id={}", savedTerm.getId());

        return CourseTermResponse.from(savedTerm);
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
    public CourseTermResponse updateTerm(Long id, UpdateCourseTermRequest request) {
        log.info("Updating course term: id={}", id);

        CourseTerm term = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        // 날짜 검증
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("종료일은 시작일 이후여야 합니다");
        }

        // 시간 검증
        if (request.endTime().isBefore(request.startTime()) || request.endTime().equals(request.startTime())) {
            throw new IllegalArgumentException("종료 시간은 시작 시간 이후여야 합니다");
        }

        term.update(
            request.startDate(),
            request.endDate(),
            request.daysOfWeek(),
            request.startTime(),
            request.endTime(),
            request.maxStudents()
        );

        log.info("Course term updated: id={}", id);

        return CourseTermResponse.from(term);
    }

    @Override
    public List<CourseTermResponse> searchByDateRange(LocalDate startDate, LocalDate endDate) {
        log.debug("Searching course terms by date range: {} - {}", startDate, endDate);

        return courseTermRepository.findByStartDateBetween(startDate, endDate).stream()
            .map(CourseTermResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseTermResponse duplicateTerm(Long id, LocalDate newStartDate, LocalDate newEndDate) {
        log.info("Duplicating course term: id={}, newStartDate={}, newEndDate={}", id, newStartDate, newEndDate);

        CourseTerm originalTerm = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        // 날짜 검증
        if (newEndDate.isBefore(newStartDate)) {
            throw new IllegalArgumentException("종료일은 시작일 이후여야 합니다");
        }

        // 다음 차수 번호 계산
        List<CourseTerm> existingTerms = courseTermRepository.findByCourse(originalTerm.getCourse());
        Integer nextTermNumber = existingTerms.stream()
            .map(CourseTerm::getTermNumber)
            .max(Integer::compareTo)
            .orElse(0) + 1;

        CourseTerm newTerm = CourseTerm.create(
            originalTerm.getCourse(),
            nextTermNumber,
            newStartDate,
            newEndDate,
            originalTerm.getDaysOfWeek(),
            originalTerm.getStartTime(),
            originalTerm.getEndTime(),
            originalTerm.getMaxStudents()
        );

        CourseTerm savedTerm = courseTermRepository.save(newTerm);

        log.info("Course term duplicated: original id={}, new id={}", id, savedTerm.getId());

        return CourseTermResponse.from(savedTerm);
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
