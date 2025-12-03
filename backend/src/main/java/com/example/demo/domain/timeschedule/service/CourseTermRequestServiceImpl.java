package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.timeschedule.dto.*;
import com.example.demo.domain.timeschedule.entity.*;
import com.example.demo.domain.timeschedule.exception.DuplicatePendingRequestException;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.exception.TermRequestNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermChangeRequestRepository;
import com.example.demo.domain.timeschedule.repository.CourseTermDeleteRequestRepository;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.exception.UserNotFoundException;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.exception.BadRequestException;
import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.ForbiddenException;
import com.example.demo.global.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CourseTermRequestServiceImpl implements CourseTermRequestService {

    private final CourseTermChangeRequestRepository changeRequestRepository;
    private final CourseTermDeleteRequestRepository deleteRequestRepository;
    private final CourseTermRepository courseTermRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final InstructorAssignmentRepository instructorAssignmentRepository;

    // ===== 변경 요청 (TS-015) =====

    @Override
    @Transactional
    public ChangeRequestResponse createChangeRequest(Long requesterId, CreateChangeRequestDto dto) {
        log.info("Creating change request: requesterId={}, courseTermId={}", requesterId, dto.courseTermId());

        User requester = findUserById(requesterId);
        CourseTerm courseTerm = findCourseTermById(dto.courseTermId());

        // 해당 차수의 담당 강사인지 검증
        validateInstructorAssignment(courseTerm, requester);

        // 이미 대기 중인 변경 요청이 있는지 확인
        if (changeRequestRepository.existsByCourseTermAndStatus(courseTerm, TermRequestStatus.PENDING)) {
            throw new DuplicatePendingRequestException(courseTerm.getId());
        }

        // 영향받는 수강생 수 조회
        int affectedStudentCount = (int) enrollmentRepository.countByTermAndStatus(courseTerm, EnrollmentStatus.ENROLLED);

        // 변경 요청 생성
        CourseTermChangeRequest request = CourseTermChangeRequest.create(
                courseTerm,
                requester,
                dto.startDate(),
                dto.endDate(),
                dto.daysOfWeek(),
                dto.startTime(),
                dto.endTime(),
                dto.maxStudents(),
                dto.reason(),
                affectedStudentCount
        );

        CourseTermChangeRequest savedRequest = changeRequestRepository.save(request);
        log.info("Change request created: id={}", savedRequest.getId());

        return ChangeRequestResponse.from(savedRequest);
    }

    @Override
    public List<ChangeRequestResponse> getMyChangeRequests(Long requesterId) {
        log.debug("Getting my change requests: requesterId={}", requesterId);

        User requester = findUserById(requesterId);
        return changeRequestRepository.findByRequester(requester).stream()
                .map(ChangeRequestResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelChangeRequest(Long requesterId, Long requestId) {
        log.info("Cancelling change request: requesterId={}, requestId={}", requesterId, requestId);

        CourseTermChangeRequest request = changeRequestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new TermRequestNotFoundException(requestId));

        // 본인의 요청인지 확인
        if (!request.getRequester().getId().equals(requesterId)) {
            throw new ForbiddenException(ErrorCode.TERM_REQUEST_NOT_OWNER);
        }

        request.cancel();
        log.info("Change request cancelled: id={}", requestId);
    }

    // ===== 삭제 요청 (TS-016) =====

    @Override
    @Transactional
    public DeleteRequestResponse createDeleteRequest(Long requesterId, CreateDeleteRequestDto dto) {
        log.info("Creating delete request: requesterId={}, courseTermId={}", requesterId, dto.courseTermId());

        User requester = findUserById(requesterId);
        CourseTerm courseTerm = findCourseTermById(dto.courseTermId());

        // 해당 차수의 담당 강사인지 검증
        validateInstructorAssignment(courseTerm, requester);

        // 이미 대기 중인 삭제 요청이 있는지 확인
        if (deleteRequestRepository.existsByCourseTermAndStatus(courseTerm, TermRequestStatus.PENDING)) {
            throw new DuplicatePendingRequestException(courseTerm.getId());
        }

        // 수강생이 있으면 삭제 요청 불가
        long enrolledCount = enrollmentRepository.countByTermAndStatus(courseTerm, EnrollmentStatus.ENROLLED);
        if (enrolledCount > 0) {
            throw new BadRequestException(ErrorCode.TERM_REQUEST_HAS_ENROLLMENTS,
                    "등록된 수강생이 " + enrolledCount + "명 있어 삭제 요청을 할 수 없습니다.");
        }

        // 삭제 요청 생성
        CourseTermDeleteRequest request = CourseTermDeleteRequest.create(
                courseTerm,
                requester,
                dto.reason()
        );

        CourseTermDeleteRequest savedRequest = deleteRequestRepository.save(request);
        log.info("Delete request created: id={}", savedRequest.getId());

        return DeleteRequestResponse.from(savedRequest);
    }

    @Override
    public List<DeleteRequestResponse> getMyDeleteRequests(Long requesterId) {
        log.debug("Getting my delete requests: requesterId={}", requesterId);

        User requester = findUserById(requesterId);
        return deleteRequestRepository.findByRequester(requester).stream()
                .map(DeleteRequestResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelDeleteRequest(Long requesterId, Long requestId) {
        log.info("Cancelling delete request: requesterId={}, requestId={}", requesterId, requestId);

        CourseTermDeleteRequest request = deleteRequestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new TermRequestNotFoundException(requestId));

        // 본인의 요청인지 확인
        if (!request.getRequester().getId().equals(requesterId)) {
            throw new ForbiddenException(ErrorCode.TERM_REQUEST_NOT_OWNER);
        }

        request.cancel();
        log.info("Delete request cancelled: id={}", requestId);
    }

    // ===== Admin 요청 관리 (TS-017) =====

    @Override
    public List<TermRequestListResponse> getAllRequests(TermRequestStatus status, String type) {
        log.debug("Getting all requests: status={}, type={}", status, type);

        Long tenantId = TenantContext.getTenantId();
        List<TermRequestListResponse> result = new ArrayList<>();

        // 변경 요청 조회
        if (type == null || "CHANGE".equalsIgnoreCase(type)) {
            List<CourseTermChangeRequest> changeRequests;
            if (status == null) {
                // 전체 상태 조회
                if (tenantId == null) {
                    changeRequests = changeRequestRepository.findAllWithDetails();
                } else {
                    changeRequests = changeRequestRepository.findByTenantIdWithDetails(tenantId);
                }
            } else {
                // 특정 상태 조회
                changeRequests = changeRequestRepository.findByTenantIdAndStatusWithDetails(tenantId, status);
            }
            result.addAll(changeRequests.stream()
                    .map(TermRequestListResponse::fromChangeRequest)
                    .collect(Collectors.toList()));
        }

        // 삭제 요청 조회
        if (type == null || "DELETE".equalsIgnoreCase(type)) {
            List<CourseTermDeleteRequest> deleteRequests;
            if (status == null) {
                // 전체 상태 조회
                if (tenantId == null) {
                    deleteRequests = deleteRequestRepository.findAllWithDetails();
                } else {
                    deleteRequests = deleteRequestRepository.findByTenantIdWithDetails(tenantId);
                }
            } else {
                // 특정 상태 조회
                deleteRequests = deleteRequestRepository.findByTenantIdAndStatusWithDetails(tenantId, status);
            }
            result.addAll(deleteRequests.stream()
                    .map(TermRequestListResponse::fromDeleteRequest)
                    .collect(Collectors.toList()));
        }

        // 생성일시 기준 내림차순 정렬
        result.sort(Comparator.comparing(TermRequestListResponse::createdAt).reversed());

        return result;
    }

    @Override
    public ChangeRequestResponse getChangeRequestDetail(Long requestId) {
        log.debug("Getting change request detail: requestId={}", requestId);

        CourseTermChangeRequest request = changeRequestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new TermRequestNotFoundException(requestId));

        return ChangeRequestResponse.from(request);
    }

    @Override
    public DeleteRequestResponse getDeleteRequestDetail(Long requestId) {
        log.debug("Getting delete request detail: requestId={}", requestId);

        CourseTermDeleteRequest request = deleteRequestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new TermRequestNotFoundException(requestId));

        return DeleteRequestResponse.from(request);
    }

    @Override
    @Transactional
    public ChangeRequestResponse approveChangeRequest(Long processorId, Long requestId) {
        log.info("Approving change request: processorId={}, requestId={}", processorId, requestId);

        User processor = findUserById(processorId);
        CourseTermChangeRequest request = changeRequestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new TermRequestNotFoundException(requestId));

        // 요청 승인
        request.approve(processor);

        // 차수 정보 실제 수정
        CourseTerm courseTerm = request.getCourseTerm();
        courseTerm.update(
                request.getAfterStartDate(),
                request.getAfterEndDate(),
                request.getAfterDaysOfWeek(),
                request.getAfterStartTime(),
                request.getAfterEndTime(),
                request.getAfterMaxStudents()
        );

        log.info("Change request approved and course term updated: requestId={}, courseTermId={}",
                requestId, courseTerm.getId());

        return ChangeRequestResponse.from(request);
    }

    @Override
    @Transactional
    public ChangeRequestResponse rejectChangeRequest(Long processorId, Long requestId, RejectRequestDto dto) {
        log.info("Rejecting change request: processorId={}, requestId={}", processorId, requestId);

        User processor = findUserById(processorId);
        CourseTermChangeRequest request = changeRequestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new TermRequestNotFoundException(requestId));

        request.reject(processor, dto.rejectionReason());

        log.info("Change request rejected: requestId={}", requestId);

        return ChangeRequestResponse.from(request);
    }

    @Override
    @Transactional
    public DeleteRequestResponse approveDeleteRequest(Long processorId, Long requestId) {
        log.info("Approving delete request: processorId={}, requestId={}", processorId, requestId);

        User processor = findUserById(processorId);
        CourseTermDeleteRequest request = deleteRequestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new TermRequestNotFoundException(requestId));

        // 요청 승인
        request.approve(processor);

        // 차수 취소 (Soft Delete)
        CourseTerm courseTerm = request.getCourseTerm();
        courseTerm.cancel();

        log.info("Delete request approved and course term cancelled: requestId={}, courseTermId={}",
                requestId, courseTerm.getId());

        return DeleteRequestResponse.from(request);
    }

    @Override
    @Transactional
    public DeleteRequestResponse rejectDeleteRequest(Long processorId, Long requestId, RejectRequestDto dto) {
        log.info("Rejecting delete request: processorId={}, requestId={}", processorId, requestId);

        User processor = findUserById(processorId);
        CourseTermDeleteRequest request = deleteRequestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new TermRequestNotFoundException(requestId));

        request.reject(processor, dto.rejectionReason());

        log.info("Delete request rejected: requestId={}", requestId);

        return DeleteRequestResponse.from(request);
    }

    // ===== Private Helper Methods =====

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    private CourseTerm findCourseTermById(Long courseTermId) {
        return courseTermRepository.findById(courseTermId)
                .orElseThrow(() -> new TermNotFoundException(courseTermId));
    }

    private void validateInstructorAssignment(CourseTerm courseTerm, User requester) {
        boolean isAssigned = instructorAssignmentRepository
                .findByTermAndStatus(courseTerm, AssignmentStatus.ASSIGNED)
                .map(assignment -> assignment.getInstructor().getId().equals(requester.getId()))
                .orElse(false);

        if (!isAssigned) {
            throw new ForbiddenException(ErrorCode.TERM_REQUEST_NOT_INSTRUCTOR);
        }
    }
}
