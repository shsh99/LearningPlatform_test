package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // 3. Entity 생성 및 저장
        CourseTerm term = CourseTerm.create(
            course,
            request.termNumber(),
            request.startDate(),
            request.endDate(),
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
