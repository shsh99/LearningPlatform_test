package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.AssignInstructorRequest;
import com.example.demo.domain.timeschedule.dto.InstructorAssignmentResponse;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.InstructorInformationSystem;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.timeschedule.repository.InstructorInformationSystemRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.repository.UserRepository;
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
public class InstructorAssignmentServiceImpl implements InstructorAssignmentService {

    private final InstructorAssignmentRepository assignmentRepository;
    private final CourseTermRepository courseTermRepository;
    private final UserRepository userRepository;
    private final InstructorInformationSystemRepository iisRepository;

    @Override
    @Transactional
    public InstructorAssignmentResponse assignInstructor(AssignInstructorRequest request) {
        log.info("Assigning instructor: termId={}, instructorId={}", request.termId(), request.instructorId());

        // 1. Term, Instructor, AssignedBy 조회
        CourseTerm term = courseTermRepository.findById(request.termId())
            .orElseThrow(() -> new TermNotFoundException(request.termId()));

        User instructor = userRepository.findById(request.instructorId())
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "강사 ID: " + request.instructorId()));

        User assignedBy = userRepository.findById(request.assignedById())
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "배정자 ID: " + request.assignedById()));

        // 2. Entity 생성 및 저장
        InstructorAssignment assignment = InstructorAssignment.create(term, instructor, assignedBy);
        InstructorAssignment savedAssignment = assignmentRepository.save(assignment);

        // 3. IIS(Instructor Information System)에 기록
        // userKey = instructorId, timeKey = termId
        InstructorInformationSystem iis = InstructorInformationSystem.create(
            instructor.getId(),
            term.getId(),
            savedAssignment
        );
        iisRepository.save(iis);

        log.info("Instructor assignment created: id={}, IIS recorded: userKey={}, timeKey={}",
            savedAssignment.getId(), instructor.getId(), term.getId());

        return InstructorAssignmentResponse.from(savedAssignment);
    }

    @Override
    public InstructorAssignmentResponse findById(Long id) {
        log.debug("Finding instructor assignment: id={}", id);

        InstructorAssignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "강사 배정 ID: " + id));

        return InstructorAssignmentResponse.from(assignment);
    }

    @Override
    public List<InstructorAssignmentResponse> findByTermId(Long termId) {
        log.debug("Finding instructor assignments by termId: {}", termId);

        CourseTerm term = courseTermRepository.findById(termId)
            .orElseThrow(() -> new TermNotFoundException(termId));

        return assignmentRepository.findByTerm(term).stream()
            .map(InstructorAssignmentResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<InstructorAssignmentResponse> findByInstructorId(Long instructorId) {
        log.debug("Finding instructor assignments by instructorId: {}", instructorId);

        User instructor = userRepository.findById(instructorId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "강사 ID: " + instructorId));

        return assignmentRepository.findByInstructor(instructor).stream()
            .map(InstructorAssignmentResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<InstructorAssignmentResponse> findAll() {
        log.debug("Finding all instructor assignments");

        return assignmentRepository.findAll().stream()
            .map(InstructorAssignmentResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelAssignment(Long id) {
        log.info("Cancelling instructor assignment: id={}", id);

        InstructorAssignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "강사 배정 ID: " + id));

        assignment.cancel();

        log.info("Instructor assignment cancelled: id={}", id);
    }
}
