package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.timeschedule.dto.StudentScheduleResponse;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.Schedule;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.ScheduleRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class StudentScheduleServiceImpl implements StudentScheduleService {

    private final EnrollmentRepository enrollmentRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final CourseTermRepository courseTermRepository;

    @Override
    public List<StudentScheduleResponse> getStudentSchedules(Long studentId) {
        log.debug("Getting schedules for student: {}", studentId);

        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "학생 ID: " + studentId));

        // 수강 중인 차수 목록 조회
        List<Enrollment> enrollments = enrollmentRepository.findByStudentAndStatus(student, EnrollmentStatus.ENROLLED);

        List<StudentScheduleResponse> responses = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            CourseTerm term = enrollment.getTerm();
            List<Schedule> schedules = scheduleRepository.findByTermIdWithDetails(term.getId());

            responses.add(buildStudentScheduleResponse(term, schedules));
        }

        return responses;
    }

    @Override
    public List<StudentScheduleResponse> getStudentSchedulesByDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        log.debug("Getting schedules for student {} between {} and {}", studentId, startDate, endDate);

        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "학생 ID: " + studentId));

        List<Enrollment> enrollments = enrollmentRepository.findByStudentAndStatus(student, EnrollmentStatus.ENROLLED);

        List<StudentScheduleResponse> responses = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            CourseTerm term = enrollment.getTerm();

            // 해당 기간과 차수 기간이 겹치는지 확인
            if (term.getEndDate().isBefore(startDate) || term.getStartDate().isAfter(endDate)) {
                continue;
            }

            List<Schedule> schedules = scheduleRepository.findByTermIdAndDateRange(term.getId(), startDate, endDate);

            if (!schedules.isEmpty()) {
                responses.add(buildStudentScheduleResponse(term, schedules));
            }
        }

        return responses;
    }

    @Override
    public StudentScheduleResponse getStudentScheduleByTerm(Long studentId, Long termId) {
        log.debug("Getting schedule for student {} in term {}", studentId, termId);

        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "학생 ID: " + studentId));

        CourseTerm term = courseTermRepository.findById(termId)
            .orElseThrow(() -> new TermNotFoundException(termId));

        // 해당 학생이 이 차수에 등록되어 있는지 확인
        boolean isEnrolled = enrollmentRepository.existsByTermAndStudent(term, student);
        if (!isEnrolled) {
            throw new NotFoundException(ErrorCode.ENROLLMENT_NOT_FOUND,
                String.format("학생 ID %d는 차수 ID %d에 등록되어 있지 않습니다", studentId, termId));
        }

        List<Schedule> schedules = scheduleRepository.findByTermIdWithDetails(termId);

        return buildStudentScheduleResponse(term, schedules);
    }

    private StudentScheduleResponse buildStudentScheduleResponse(CourseTerm term, List<Schedule> schedules) {
        List<StudentScheduleResponse.ScheduleItem> scheduleItems = schedules.stream()
            .map(StudentScheduleResponse.ScheduleItem::from)
            .toList();

        return new StudentScheduleResponse(
            term.getId(),
            term.getCourse().getTitle(),
            term.getTermNumber(),
            term.getStartDate(),
            term.getEndDate(),
            scheduleItems
        );
    }
}
