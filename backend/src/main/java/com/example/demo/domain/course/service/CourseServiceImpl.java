package com.example.demo.domain.course.service;

import com.example.demo.domain.course.dto.CourseResponse;
import com.example.demo.domain.course.dto.CreateCourseRequest;
import com.example.demo.domain.course.dto.UpdateCourseRequest;
import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.entity.CourseStatus;
import com.example.demo.domain.course.exception.CourseNotFoundException;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.exception.UserNotFoundException;
import com.example.demo.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Course Service 구현체
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    // ===== 생성 (@Transactional) =====
    @Override
    @Transactional
    public CourseResponse create(CreateCourseRequest request) {
        log.info("Creating course: title={}", request.title());

        // OPERATOR가 생성하는 경우에는 바로 APPROVED 상태
        Course course = Course.create(
            request.title(),
            request.description(),
            request.maxStudents()
        );
        Course savedCourse = courseRepository.save(course);

        log.info("Course created: id={}", savedCourse.getId());

        return CourseResponse.from(savedCourse);
    }

    // ===== 조회 (readOnly = true) =====
    @Override
    public CourseResponse findById(Long id) {
        log.debug("Finding course: id={}", id);

        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new CourseNotFoundException(id));

        return CourseResponse.from(course);
    }

    @Override
    public List<CourseResponse> findAll() {
        log.debug("Finding all courses");

        return courseRepository.findAll().stream()
            .map(CourseResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> findByStatus(CourseStatus status) {
        log.debug("Finding courses by status: status={}", status);

        return courseRepository.findByStatus(status).stream()
            .map(CourseResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> searchByTitle(String keyword) {
        log.debug("Searching courses by title: keyword={}", keyword);

        return courseRepository.findByTitleContaining(keyword).stream()
            .map(CourseResponse::from)
            .collect(Collectors.toList());
    }

    // ===== 수정 (@Transactional) =====
    @Override
    @Transactional
    public CourseResponse update(Long id, UpdateCourseRequest request) {
        log.info("Updating course: id={}", id);

        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new CourseNotFoundException(id));

        // 수정 메서드 호출 (Entity에 추가 필요)
        course.update(
            request.title(),
            request.description(),
            request.maxStudents()
        );

        log.info("Course updated: id={}", id);

        return CourseResponse.from(course);
    }

    // ===== 삭제 (@Transactional) =====
    @Override
    @Transactional
    public void delete(Long id) {
        log.info("Deleting course: id={}", id);

        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new CourseNotFoundException(id));

        courseRepository.delete(course);

        log.info("Course deleted: id={}", id);
    }

    // ===== 상태 변경 (@Transactional) =====
    @Override
    @Transactional
    public CourseResponse approve(Long id) {
        log.info("Approving course: id={}", id);

        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new CourseNotFoundException(id));

        course.approve();

        log.info("Course approved: id={}", id);

        return CourseResponse.from(course);
    }

    @Override
    @Transactional
    public CourseResponse reject(Long id) {
        log.info("Rejecting course: id={}", id);

        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new CourseNotFoundException(id));

        course.reject();

        log.info("Course rejected: id={}", id);

        return CourseResponse.from(course);
    }
}
