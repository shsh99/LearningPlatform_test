package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.InstructorScheduleResponse;
import com.example.demo.domain.timeschedule.entity.AssignmentStatus;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.Schedule;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
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
public class InstructorScheduleServiceImpl implements InstructorScheduleService {

    private final InstructorAssignmentRepository assignmentRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final CourseTermRepository courseTermRepository;

    @Override
    public List<InstructorScheduleResponse> getInstructorSchedules(Long instructorId) {
        log.debug("Getting schedules for instructor: {}", instructorId);

        User instructor = userRepository.findById(instructorId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "강사 ID: " + instructorId));

        // 강사에게 배정된 차수 목록 조회 (ASSIGNED 상태)
        List<InstructorAssignment> assignments = assignmentRepository.findByInstructorAndStatus(instructor, AssignmentStatus.ASSIGNED);

        List<InstructorScheduleResponse> responses = new ArrayList<>();
        for (InstructorAssignment assignment : assignments) {
            CourseTerm term = assignment.getTerm();
            List<Schedule> schedules = scheduleRepository.findByTermIdWithDetails(term.getId());

            responses.add(buildInstructorScheduleResponse(term, assignment.getStatus(), schedules));
        }

        return responses;
    }

    @Override
    public List<InstructorScheduleResponse> getInstructorSchedulesByDateRange(Long instructorId, LocalDate startDate, LocalDate endDate) {
        log.debug("Getting schedules for instructor {} between {} and {}", instructorId, startDate, endDate);

        User instructor = userRepository.findById(instructorId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "강사 ID: " + instructorId));

        List<InstructorAssignment> assignments = assignmentRepository.findByInstructorAndStatus(instructor, AssignmentStatus.ASSIGNED);

        List<InstructorScheduleResponse> responses = new ArrayList<>();
        for (InstructorAssignment assignment : assignments) {
            CourseTerm term = assignment.getTerm();

            // 해당 기간과 차수 기간이 겹치는지 확인
            if (term.getEndDate().isBefore(startDate) || term.getStartDate().isAfter(endDate)) {
                continue;
            }

            List<Schedule> schedules = scheduleRepository.findByTermIdAndDateRange(term.getId(), startDate, endDate);

            if (!schedules.isEmpty()) {
                responses.add(buildInstructorScheduleResponse(term, assignment.getStatus(), schedules));
            }
        }

        return responses;
    }

    @Override
    public InstructorScheduleResponse getInstructorScheduleByTerm(Long instructorId, Long termId) {
        log.debug("Getting schedule for instructor {} in term {}", instructorId, termId);

        // 강사 존재 확인
        if (!userRepository.existsById(instructorId)) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND, "강사 ID: " + instructorId);
        }

        CourseTerm term = courseTermRepository.findById(termId)
            .orElseThrow(() -> new TermNotFoundException(termId));

        // 해당 강사가 이 차수에 배정되어 있는지 확인
        InstructorAssignment assignment = assignmentRepository.findByTermAndStatus(term, AssignmentStatus.ASSIGNED)
            .filter(a -> a.getInstructor().getId().equals(instructorId))
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND,
                String.format("강사 ID %d는 차수 ID %d에 배정되어 있지 않습니다", instructorId, termId)));

        List<Schedule> schedules = scheduleRepository.findByTermIdWithDetails(termId);

        return buildInstructorScheduleResponse(term, assignment.getStatus(), schedules);
    }

    @Override
    public List<InstructorScheduleResponse.ScheduleItem> getInstructorTodaySchedules(Long instructorId) {
        log.debug("Getting today's schedules for instructor: {}", instructorId);

        // 강사 존재 확인
        if (!userRepository.existsById(instructorId)) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND, "강사 ID: " + instructorId);
        }

        LocalDate today = LocalDate.now();

        List<Schedule> todaySchedules = scheduleRepository.findByInstructorIdAndScheduleDate(instructorId, today);

        return todaySchedules.stream()
            .map(InstructorScheduleResponse.ScheduleItem::from)
            .toList();
    }

    private InstructorScheduleResponse buildInstructorScheduleResponse(CourseTerm term, AssignmentStatus status, List<Schedule> schedules) {
        List<InstructorScheduleResponse.ScheduleItem> scheduleItems = schedules.stream()
            .map(InstructorScheduleResponse.ScheduleItem::from)
            .toList();

        return new InstructorScheduleResponse(
            term.getId(),
            term.getCourse().getTitle(),
            term.getTermNumber(),
            term.getStartDate(),
            term.getEndDate(),
            status.name(),
            scheduleItems
        );
    }
}
