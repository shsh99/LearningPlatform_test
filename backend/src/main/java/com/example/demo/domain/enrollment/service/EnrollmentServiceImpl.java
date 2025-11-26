package com.example.demo.domain.enrollment.service;

import com.example.demo.domain.enrollment.dto.CreateEnrollmentRequest;
import com.example.demo.domain.enrollment.dto.DirectEnrollmentRequest;
import com.example.demo.domain.enrollment.dto.EnrollmentResponse;
import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.entity.StudentInformationSystem;
import com.example.demo.domain.enrollment.exception.EnrollmentNotFoundException;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.enrollment.repository.StudentInformationSystemRepository;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.exception.UserNotFoundException;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
        CourseTerm term = courseTermRepository.findById(request.termId())
            .orElseThrow(() -> new TermNotFoundException(request.termId()));

        User student = userRepository.findById(request.studentId())
            .orElseThrow(() -> new UserNotFoundException(request.studentId()));

        // 수강 인원 증가
        term.increaseStudentCount();

        Enrollment enrollment = Enrollment.create(term, student);
        Enrollment saved = enrollmentRepository.save(enrollment);

        // SIS(Student Information System)에 기록
        // userKey = studentId, timeKey = termId
        StudentInformationSystem sis = StudentInformationSystem.create(
            student.getId(),
            term.getId(),
            saved
        );
        sisRepository.save(sis);

        return EnrollmentResponse.from(saved);
    }

    @Override
    @Transactional
    public EnrollmentResponse directEnrollment(DirectEnrollmentRequest request) {
        // 1. 유저 조회
        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new UserNotFoundException(request.userId()));

        // 2. 차수 조회
        CourseTerm term = courseTermRepository.findById(request.termId())
            .orElseThrow(() -> new TermNotFoundException(request.termId()));

        // 3. 중복 신청 확인
        boolean exists = enrollmentRepository.existsByTermAndStudent(term, user);
        if (exists) {
            throw new BusinessException(ErrorCode.ALREADY_ENROLLED);
        }

        // 4. 정원 확인
        if (term.getCurrentStudents() >= term.getMaxStudents()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "정원이 초과되었습니다.");
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
    @Transactional
    public void cancelEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
            .orElseThrow(() -> new EnrollmentNotFoundException(id));

        // 수강 인원 감소
        CourseTerm term = enrollment.getTerm();
        term.decreaseStudentCount();

        enrollment.cancel();
    }

    @Override
    @Transactional
    public EnrollmentResponse completeEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
            .orElseThrow(() -> new EnrollmentNotFoundException(id));
        // 완료 처리 로직 (엔티티에 complete 메서드 추가 필요)
        return EnrollmentResponse.from(enrollment);
    }
}
