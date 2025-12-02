package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.exception.CourseNotFoundException;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.timeschedule.dto.CourseTermDetailResponse;
import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;
import com.example.demo.domain.timeschedule.dto.UpdateCourseTermRequest;
import com.example.demo.domain.timeschedule.entity.AssignmentStatus;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.timeschedule.exception.InvalidTermDateRangeException;
import com.example.demo.domain.timeschedule.exception.InvalidTermStatusTransitionException;
import com.example.demo.domain.timeschedule.exception.TermAlreadyStartedException;
import com.example.demo.domain.timeschedule.exception.TermHasEnrollmentsException;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.global.tenant.TenantContext;
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
    private final EnrollmentRepository enrollmentRepository;
    private final InstructorAssignmentRepository instructorAssignmentRepository;

    @Override
    @Transactional
    public CourseTermResponse createTerm(CreateCourseTermRequest request) {
        log.info("Creating course term: courseId={}, termNumber={}", request.courseId(), request.termNumber());

        // 1. Course 조회
        Course course = courseRepository.findById(request.courseId())
            .orElseThrow(() -> new CourseNotFoundException(request.courseId()));

        // 2. 날짜 검증
        if (request.endDate().isBefore(request.startDate())) {
            throw new InvalidTermDateRangeException(request.startDate(), request.endDate());
        }

        // 3. 시간 검증
        if (request.endTime().isBefore(request.startTime()) || request.endTime().equals(request.startTime())) {
            throw new InvalidTermDateRangeException(request.startDate(), request.endDate());
        }

        // 4. 중복 차수 번호 검증
        if (courseTermRepository.findByCourseAndTermNumber(course, request.termNumber()).isPresent()) {
            log.warn("중복된 차수 번호: courseId={}, termNumber={}", request.courseId(), request.termNumber());
        }

        // 5. Entity 생성 및 저장
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
    public CourseTermDetailResponse findDetailById(Long id) {
        log.debug("Finding course term detail: id={}", id);

        // 1. CourseTerm 조회
        CourseTerm term = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        // 2. 수강생 목록 조회
        List<Enrollment> enrollments = enrollmentRepository.findByTerm(term);

        // 3. 현재 배정된 강사 조회 (ASSIGNED 상태만)
        InstructorAssignment currentInstructor = instructorAssignmentRepository
            .findByTermAndStatus(term, AssignmentStatus.ASSIGNED)
            .orElse(null);

        // 4. DTO 변환 및 반환
        return CourseTermDetailResponse.from(term, enrollments, currentInstructor);
    }

    @Override
    public List<CourseTermResponse> findByCourseId(Long courseId) {
        log.debug("Finding course terms by courseId: {}", courseId);

        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new CourseNotFoundException(courseId));

        return courseTermRepository.findByCourse(course).stream()
            .map(CourseTermResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<CourseTermResponse> findAll() {
        log.debug("Finding all course terms");

        Long tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            return courseTermRepository.findByTenantId(tenantId).stream()
                .map(CourseTermResponse::from)
                .collect(Collectors.toList());
        }
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

        // 1. 진행 중이거나 완료된 차수는 수정 불가
        if (term.getStatus() == TermStatus.ONGOING || term.getStatus() == TermStatus.COMPLETED) {
            throw new TermAlreadyStartedException(id, term.getStartDate());
        }

        // 2. 날짜 검증
        if (request.endDate().isBefore(request.startDate())) {
            throw new InvalidTermDateRangeException(request.startDate(), request.endDate());
        }

        // 3. 시간 검증
        if (request.endTime().isBefore(request.startTime()) || request.endTime().equals(request.startTime())) {
            throw new InvalidTermDateRangeException(request.startDate(), request.endDate());
        }

        // 4. 현재 수강생보다 적은 정원으로 변경 불가
        if (request.maxStudents() < term.getCurrentStudents()) {
            log.warn("정원 축소 불가: 현재 수강생={}, 요청 정원={}", term.getCurrentStudents(), request.maxStudents());
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

        // 예정 상태에서만 시작 가능
        if (term.getStatus() != TermStatus.SCHEDULED) {
            throw new InvalidTermStatusTransitionException(term.getStatus(), TermStatus.ONGOING);
        }

        term.start();

        log.info("Course term started: id={}", id);
    }

    @Override
    @Transactional
    public void completeTerm(Long id) {
        log.info("Completing course term: id={}", id);

        CourseTerm term = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        // 진행 중인 상태에서만 완료 가능
        if (term.getStatus() != TermStatus.ONGOING) {
            throw new InvalidTermStatusTransitionException(term.getStatus(), TermStatus.COMPLETED);
        }

        // 모든 수강생의 수강 상태를 완료로 변경
        List<Enrollment> enrollments = enrollmentRepository.findByTerm(term);
        for (Enrollment enrollment : enrollments) {
            if (enrollment.getStatus() == EnrollmentStatus.ENROLLED) {
                enrollment.complete();
            }
        }

        term.complete();

        log.info("Course term completed: id={}, enrollments completed: {}", id, enrollments.size());
    }

    @Override
    @Transactional
    public void cancelTerm(Long id) {
        log.info("Cancelling course term: id={}", id);

        CourseTerm term = courseTermRepository.findById(id)
            .orElseThrow(() -> new TermNotFoundException(id));

        // 이미 완료되었거나 진행 중인 차수는 취소 불가
        if (term.getStatus() == TermStatus.ONGOING) {
            throw new InvalidTermStatusTransitionException(term.getStatus(), TermStatus.CANCELLED);
        }

        if (term.getStatus() == TermStatus.COMPLETED) {
            throw new InvalidTermStatusTransitionException(term.getStatus(), TermStatus.CANCELLED);
        }

        // 수강생이 있는 경우 경고
        long enrollmentCount = enrollmentRepository.countByTermAndStatus(term, EnrollmentStatus.ENROLLED);
        if (enrollmentCount > 0) {
            throw new TermHasEnrollmentsException(id, (int) enrollmentCount);
        }

        term.cancel();

        log.info("Course term cancelled: id={}", id);
    }
}
