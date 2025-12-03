package com.example.demo.domain.courseapplication.service;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.entity.CourseStatus;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.courseapplication.dto.CourseApplicationResponse;
import com.example.demo.domain.courseapplication.dto.CreateCourseApplicationRequest;
import com.example.demo.domain.courseapplication.entity.ApplicationStatus;
import com.example.demo.domain.courseapplication.entity.CourseApplication;
import com.example.demo.domain.courseapplication.exception.CourseApplicationNotFoundException;
import com.example.demo.domain.courseapplication.repository.CourseApplicationRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.exception.UserNotFoundException;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * CourseApplication Service Implementation
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class CourseApplicationServiceImpl implements CourseApplicationService {

    private final CourseApplicationRepository courseApplicationRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CourseApplicationResponse create(Long applicantId, CreateCourseApplicationRequest request) {
        User applicant = userRepository.findById(applicantId)
            .orElseThrow(() -> new UserNotFoundException(applicantId));

        // CourseApplication 생성 (Course는 승인 시 생성)
        CourseApplication application = CourseApplication.create(
            request.title(),
            request.description(),
            50, // 기본 50명
            applicant
        );
        CourseApplication saved = courseApplicationRepository.save(application);

        return CourseApplicationResponse.from(saved);
    }

    @Override
    public CourseApplicationResponse findById(Long id) {
        CourseApplication application = courseApplicationRepository.findById(id)
            .orElseThrow(() -> new CourseApplicationNotFoundException(id));
        return CourseApplicationResponse.from(application);
    }

    @Override
    public List<CourseApplicationResponse> findByApplicantId(Long applicantId) {
        return courseApplicationRepository.findByApplicantId(applicantId)
            .stream()
            .map(CourseApplicationResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseApplicationResponse> findByStatus(ApplicationStatus status) {
        return courseApplicationRepository.findByStatus(status)
            .stream()
            .map(CourseApplicationResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseApplicationResponse> findByApplicantIdAndStatus(Long applicantId, ApplicationStatus status) {
        return courseApplicationRepository.findByApplicantIdAndStatus(applicantId, status)
            .stream()
            .map(CourseApplicationResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseApplicationResponse> findAll() {
        return courseApplicationRepository.findAll()
            .stream()
            .map(CourseApplicationResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseApplicationResponse approve(Long id) {
        CourseApplication application = courseApplicationRepository.findById(id)
            .orElseThrow(() -> new CourseApplicationNotFoundException(id));

        log.info("Approving application: id={}, title={}, tenantId={}",
            application.getId(), application.getTitle(), application.getTenantId());

        // 승인 시 Course 생성 (CourseApplication의 tenantId를 명시적으로 전달)
        Course course = Course.create(
            application.getTitle(),
            application.getDescription(),
            application.getMaxStudents(),
            application.getTenantId()
        );
        Course savedCourse = courseRepository.save(course);

        log.info("Course created: id={}, title={}, tenantId={}",
            savedCourse.getId(), savedCourse.getTitle(), savedCourse.getTenantId());

        // CourseApplication 승인 처리
        application.approve(savedCourse);

        return CourseApplicationResponse.from(application);
    }

    @Override
    @Transactional
    public CourseApplicationResponse reject(Long id, String reason) {
        CourseApplication application = courseApplicationRepository.findById(id)
            .orElseThrow(() -> new CourseApplicationNotFoundException(id));

        application.reject(reason);
        return CourseApplicationResponse.from(application);
    }

    @Override
    @Transactional
    public void cancel(Long id, Long applicantId) {
        CourseApplication application = courseApplicationRepository.findById(id)
            .orElseThrow(() -> new CourseApplicationNotFoundException(id));

        if (!application.getApplicant().getId().equals(applicantId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "본인의 신청만 취소할 수 있습니다.");
        }

        if (!application.isPending()) {
            throw new IllegalStateException("대기 중인 신청만 취소할 수 있습니다.");
        }

        courseApplicationRepository.delete(application);
    }
}
