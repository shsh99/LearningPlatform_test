package com.example.demo.domain.enrollment.service;

import com.example.demo.domain.enrollment.dto.CreateEnrollmentRequest;
import com.example.demo.domain.enrollment.dto.DirectEnrollmentRequest;
import com.example.demo.domain.enrollment.dto.EnrollmentResponse;
import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.entity.StudentInformationSystem;
import com.example.demo.domain.enrollment.exception.CannotCancelStartedCourseException;
import com.example.demo.domain.enrollment.exception.DuplicateEnrollmentException;
import com.example.demo.domain.enrollment.exception.EnrollmentAlreadyCancelledException;
import com.example.demo.domain.enrollment.exception.EnrollmentNotFoundException;
import com.example.demo.domain.enrollment.exception.TermCapacityExceededException;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.enrollment.repository.StudentInformationSystemRepository;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.exception.UserNotFoundException;
import com.example.demo.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseTermRepository courseTermRepository;
    private final UserRepository userRepository;
    private final StudentInformationSystemRepository sisRepository;

    @Override
    @Transactional
    public EnrollmentResponse createEnrollment(CreateEnrollmentRequest request) {
        log.info("수강신청 생성 시작: termId={}, studentId={}", request.termId(), request.studentId());

        // 1. 차수 조회
        CourseTerm term = courseTermRepository.findById(request.termId())
            .orElseThrow(() -> new TermNotFoundException(request.termId()));

        // 2. 학생 조회
        User student = userRepository.findById(request.studentId())
            .orElseThrow(() -> new UserNotFoundException(request.studentId()));

        // 3. 중복 수강신청 검증
        if (enrollmentRepository.existsByTermAndStudent(term, student)) {
            throw new DuplicateEnrollmentException(request.termId(), request.studentId());
        }

        // 4. 차수 상태 검증 (예정 상태에서만 신청 가능)
        if (term.getStatus() != TermStatus.SCHEDULED) {
            throw new TermCapacityExceededException();
        }

        // 5. 정원 검증
        if (term.getCurrentStudents() >= term.getMaxStudents()) {
            throw new TermCapacityExceededException(term.getId(), term.getMaxStudents(), term.getCurrentStudents());
        }

        // 6. 수강 인원 증가
        term.increaseStudentCount();

        // 7. 수강신청 생성
        Enrollment enrollment = Enrollment.create(term, student);
        Enrollment saved = enrollmentRepository.save(enrollment);

        // 8. SIS(Student Information System)에 기록
        StudentInformationSystem sis = StudentInformationSystem.create(
            student.getId(),
            term.getId(),
            saved
        );
        sisRepository.save(sis);

        log.info("수강신청 생성 완료: enrollmentId={}", saved.getId());
        return EnrollmentResponse.from(saved);
    }

    @Override
    @Transactional
    public EnrollmentResponse directEnrollment(DirectEnrollmentRequest request) {
        log.info("관리자 직접 수강등록 시작: termId={}, userId={}", request.termId(), request.userId());

        // 1. 유저 조회
        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new UserNotFoundException(request.userId()));

        // 2. 차수 조회
        CourseTerm term = courseTermRepository.findById(request.termId())
            .orElseThrow(() -> new TermNotFoundException(request.termId()));

        // 3. 중복 신청 확인
        if (enrollmentRepository.existsByTermAndStudent(term, user)) {
            throw new DuplicateEnrollmentException(request.termId(), request.userId());
        }

        // 4. 정원 확인
        if (term.getCurrentStudents() >= term.getMaxStudents()) {
            throw new TermCapacityExceededException(term.getId(), term.getMaxStudents(), term.getCurrentStudents());
        }

        // 5. 수강 신청 생성 (관리자는 바로 ENROLLED 상태로)
        Enrollment enrollment = Enrollment.createEnrolled(user, term);
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // 6. 차수 수강생 수 증가
        term.increaseStudentCount();

        // 7. SIS 레코드 생성
        StudentInformationSystem sis = StudentInformationSystem.create(
            user.getId(),
            term.getId(),
            savedEnrollment
        );
        sisRepository.save(sis);

        log.info("관리자 직접 수강등록 완료: enrollmentId={}", savedEnrollment.getId());
        return EnrollmentResponse.from(savedEnrollment);
    }

    @Override
    public EnrollmentResponse findById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
            .orElseThrow(() -> new EnrollmentNotFoundException(id));
        return EnrollmentResponse.from(enrollment);
    }

    @Override
    public List<EnrollmentResponse> findByStudentId(Long studentId) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new UserNotFoundException(studentId));

        return enrollmentRepository.findByStudent(student).stream()
            .map(EnrollmentResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<EnrollmentResponse> findByTermId(Long termId) {
        CourseTerm term = courseTermRepository.findById(termId)
            .orElseThrow(() -> new TermNotFoundException(termId));

        return enrollmentRepository.findByTerm(term).stream()
            .map(EnrollmentResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<EnrollmentResponse> findByStudentIdAndStatus(Long studentId, String status) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new UserNotFoundException(studentId));

        EnrollmentStatus enrollmentStatus = EnrollmentStatus.valueOf(status.toUpperCase());

        return enrollmentRepository.findByStudentAndStatus(student, enrollmentStatus).stream()
            .map(EnrollmentResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<EnrollmentResponse> findByTermIdAndStatus(Long termId, String status) {
        CourseTerm term = courseTermRepository.findById(termId)
            .orElseThrow(() -> new TermNotFoundException(termId));

        EnrollmentStatus enrollmentStatus = EnrollmentStatus.valueOf(status.toUpperCase());

        return enrollmentRepository.findEnrollmentsWithStudentByTermAndStatus(term, enrollmentStatus).stream()
            .map(EnrollmentResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelEnrollment(Long id) {
        log.info("수강신청 취소 시작: enrollmentId={}", id);

        Enrollment enrollment = enrollmentRepository.findById(id)
            .orElseThrow(() -> new EnrollmentNotFoundException(id));

        // 1. 이미 취소된 수강신청인지 확인
        if (enrollment.getStatus() == EnrollmentStatus.CANCELLED) {
            throw new EnrollmentAlreadyCancelledException(id);
        }

        // 2. 진행 중인 강의는 취소 불가
        CourseTerm term = enrollment.getTerm();
        if (term.getStatus() == TermStatus.ONGOING) {
            throw new CannotCancelStartedCourseException(term.getStartDate());
        }

        // 3. 수강 인원 감소
        term.decreaseStudentCount();

        // 4. 수강신청 취소
        enrollment.cancel();

        log.info("수강신청 취소 완료: enrollmentId={}", id);
    }

    @Override
    @Transactional
    public EnrollmentResponse completeEnrollment(Long id) {
        log.info("수강 완료 처리 시작: enrollmentId={}", id);

        Enrollment enrollment = enrollmentRepository.findById(id)
            .orElseThrow(() -> new EnrollmentNotFoundException(id));

        // 1. 진행 중인 상태에서만 완료 가능
        if (enrollment.getStatus() != EnrollmentStatus.ENROLLED) {
            log.warn("수강 완료 처리 실패 - 잘못된 상태: enrollmentId={}, status={}", id, enrollment.getStatus());
            throw new EnrollmentAlreadyCancelledException(id);
        }

        // 2. 완료 처리
        enrollment.complete();

        log.info("수강 완료 처리 완료: enrollmentId={}", id);
        return EnrollmentResponse.from(enrollment);
    }
}
