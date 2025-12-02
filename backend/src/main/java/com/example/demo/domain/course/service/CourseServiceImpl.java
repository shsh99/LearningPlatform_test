package com.example.demo.domain.course.service;

import com.example.demo.domain.course.dto.CourseResponse;
import com.example.demo.domain.course.dto.CreateCourseRequest;
import com.example.demo.domain.course.dto.UpdateCourseRequest;
import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.entity.CourseStatus;
import com.example.demo.domain.course.exception.CourseNotFoundException;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.global.tenant.TenantContext;
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

        Course course = findCourseWithTenantCheck(id);
        return CourseResponse.from(course);
    }

    /**
     * ID로 강의 조회 시 테넌트 검증 수행
     * SUPER_ADMIN(tenantId=null)은 모든 강의 접근 가능
     */
    private Course findCourseWithTenantCheck(Long id) {
        Long tenantId = TenantContext.getTenantId();

        if (tenantId == null) {
            // SUPER_ADMIN: 모든 강의 접근 가능
            return courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException(id));
        }

        // 일반 사용자: 본인 테넌트 강의만 접근 가능
        return courseRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new CourseNotFoundException(id));
    }

    @Override
    public List<CourseResponse> findAll() {
        log.debug("Finding all courses");

        Long tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            return courseRepository.findByTenantId(tenantId).stream()
                .map(CourseResponse::from)
                .collect(Collectors.toList());
        }
        return courseRepository.findAll().stream()
            .map(CourseResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> findByStatus(CourseStatus status) {
        log.debug("Finding courses by status: status={}", status);

        Long tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            return courseRepository.findByTenantIdAndStatus(tenantId, status).stream()
                .map(CourseResponse::from)
                .collect(Collectors.toList());
        }
        return courseRepository.findByStatus(status).stream()
            .map(CourseResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> searchByTitle(String keyword) {
        log.debug("Searching courses by title: keyword={}", keyword);

        Long tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            return courseRepository.findByTenantIdAndTitleContaining(tenantId, keyword).stream()
                .map(CourseResponse::from)
                .collect(Collectors.toList());
        }
        return courseRepository.findByTitleContaining(keyword).stream()
            .map(CourseResponse::from)
            .collect(Collectors.toList());
    }

    // ===== 수정 (@Transactional) =====
    @Override
    @Transactional
    public CourseResponse update(Long id, UpdateCourseRequest request) {
        log.info("Updating course: id={}", id);

        Course course = findCourseWithTenantCheck(id);

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

        Course course = findCourseWithTenantCheck(id);
        courseRepository.delete(course);

        log.info("Course deleted: id={}", id);
    }

    // ===== 상태 변경 (@Transactional) =====
    @Override
    @Transactional
    public CourseResponse approve(Long id) {
        log.info("Approving course: id={}", id);

        Course course = findCourseWithTenantCheck(id);
        course.approve();

        log.info("Course approved: id={}", id);

        return CourseResponse.from(course);
    }

    @Override
    @Transactional
    public CourseResponse reject(Long id) {
        log.info("Rejecting course: id={}", id);

        Course course = findCourseWithTenantCheck(id);
        course.reject();

        log.info("Course rejected: id={}", id);

        return CourseResponse.from(course);
    }
}
