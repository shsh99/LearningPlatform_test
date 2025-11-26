package com.example.demo.domain.enrollment.service;

import com.example.demo.domain.enrollment.dto.CreateEnrollmentRequest;
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
