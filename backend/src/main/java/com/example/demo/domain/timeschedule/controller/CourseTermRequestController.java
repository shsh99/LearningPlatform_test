package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.*;
import com.example.demo.domain.timeschedule.entity.TermRequestStatus;
import com.example.demo.domain.timeschedule.service.CourseTermRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * 차수 변경/삭제 요청 Controller
 */
@RestController
@RequestMapping("/api/course-term-requests")
@RequiredArgsConstructor
@Validated
@Slf4j
public class CourseTermRequestController {

    private final CourseTermRequestService courseTermRequestService;

    // ===== 변경 요청 API (TS-015) =====

    /**
     * 변경 요청 생성
     * POST /api/course-term-requests/change
     */
    @PostMapping("/change")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ChangeRequestResponse> createChangeRequest(
            Principal principal,
            @Valid @RequestBody CreateChangeRequestDto request
    ) {
        Long requesterId = Long.parseLong(principal.getName());
        log.info("POST /api/course-term-requests/change - requesterId: {}, courseTermId: {}",
                requesterId, request.courseTermId());

        ChangeRequestResponse response = courseTermRequestService.createChangeRequest(requesterId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 내 변경 요청 목록 조회
     * GET /api/course-term-requests/change/my
     */
    @GetMapping("/change/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChangeRequestResponse>> getMyChangeRequests(Principal principal) {
        Long requesterId = Long.parseLong(principal.getName());
        log.info("GET /api/course-term-requests/change/my - requesterId: {}", requesterId);

        List<ChangeRequestResponse> response = courseTermRequestService.getMyChangeRequests(requesterId);
        return ResponseEntity.ok(response);
    }

    /**
     * 변경 요청 취소
     * DELETE /api/course-term-requests/change/{id}
     */
    @DeleteMapping("/change/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> cancelChangeRequest(Principal principal, @PathVariable Long id) {
        Long requesterId = Long.parseLong(principal.getName());
        log.info("DELETE /api/course-term-requests/change/{} - requesterId: {}", id, requesterId);

        courseTermRequestService.cancelChangeRequest(requesterId, id);
        return ResponseEntity.noContent().build();
    }

    // ===== 삭제 요청 API (TS-016) =====

    /**
     * 삭제 요청 생성
     * POST /api/course-term-requests/delete
     */
    @PostMapping("/delete")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<DeleteRequestResponse> createDeleteRequest(
            Principal principal,
            @Valid @RequestBody CreateDeleteRequestDto request
    ) {
        Long requesterId = Long.parseLong(principal.getName());
        log.info("POST /api/course-term-requests/delete - requesterId: {}, courseTermId: {}",
                requesterId, request.courseTermId());

        DeleteRequestResponse response = courseTermRequestService.createDeleteRequest(requesterId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 내 삭제 요청 목록 조회
     * GET /api/course-term-requests/delete/my
     */
    @GetMapping("/delete/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DeleteRequestResponse>> getMyDeleteRequests(Principal principal) {
        Long requesterId = Long.parseLong(principal.getName());
        log.info("GET /api/course-term-requests/delete/my - requesterId: {}", requesterId);

        List<DeleteRequestResponse> response = courseTermRequestService.getMyDeleteRequests(requesterId);
        return ResponseEntity.ok(response);
    }

    /**
     * 삭제 요청 취소
     * DELETE /api/course-term-requests/delete/{id}
     */
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> cancelDeleteRequest(Principal principal, @PathVariable Long id) {
        Long requesterId = Long.parseLong(principal.getName());
        log.info("DELETE /api/course-term-requests/delete/{} - requesterId: {}", id, requesterId);

        courseTermRequestService.cancelDeleteRequest(requesterId, id);
        return ResponseEntity.noContent().build();
    }

    // ===== Admin 요청 관리 API (TS-017) =====

    /**
     * 요청 목록 조회 (변경+삭제 통합)
     * GET /api/course-term-requests?status=PENDING&type=CHANGE|DELETE
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<List<TermRequestListResponse>> getAllRequests(
            @RequestParam(defaultValue = "PENDING") TermRequestStatus status,
            @RequestParam(required = false) String type
    ) {
        log.info("GET /api/course-term-requests - status: {}, type: {}", status, type);

        List<TermRequestListResponse> response = courseTermRequestService.getAllRequests(status, type);
        return ResponseEntity.ok(response);
    }

    /**
     * 변경 요청 상세 조회
     * GET /api/course-term-requests/change/{id}
     */
    @GetMapping("/change/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'INSTRUCTOR')")
    public ResponseEntity<ChangeRequestResponse> getChangeRequestDetail(@PathVariable Long id) {
        log.info("GET /api/course-term-requests/change/{}", id);

        ChangeRequestResponse response = courseTermRequestService.getChangeRequestDetail(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 삭제 요청 상세 조회
     * GET /api/course-term-requests/delete/{id}
     */
    @GetMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'INSTRUCTOR')")
    public ResponseEntity<DeleteRequestResponse> getDeleteRequestDetail(@PathVariable Long id) {
        log.info("GET /api/course-term-requests/delete/{}", id);

        DeleteRequestResponse response = courseTermRequestService.getDeleteRequestDetail(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 변경 요청 승인
     * PATCH /api/course-term-requests/change/{id}/approve
     */
    @PatchMapping("/change/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ChangeRequestResponse> approveChangeRequest(
            Principal principal,
            @PathVariable Long id
    ) {
        Long processorId = Long.parseLong(principal.getName());
        log.info("PATCH /api/course-term-requests/change/{}/approve - processorId: {}", id, processorId);

        ChangeRequestResponse response = courseTermRequestService.approveChangeRequest(processorId, id);
        return ResponseEntity.ok(response);
    }

    /**
     * 변경 요청 반려
     * PATCH /api/course-term-requests/change/{id}/reject
     */
    @PatchMapping("/change/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ChangeRequestResponse> rejectChangeRequest(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody RejectRequestDto request
    ) {
        Long processorId = Long.parseLong(principal.getName());
        log.info("PATCH /api/course-term-requests/change/{}/reject - processorId: {}", id, processorId);

        ChangeRequestResponse response = courseTermRequestService.rejectChangeRequest(processorId, id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 삭제 요청 승인
     * PATCH /api/course-term-requests/delete/{id}/approve
     */
    @PatchMapping("/delete/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<DeleteRequestResponse> approveDeleteRequest(
            Principal principal,
            @PathVariable Long id
    ) {
        Long processorId = Long.parseLong(principal.getName());
        log.info("PATCH /api/course-term-requests/delete/{}/approve - processorId: {}", id, processorId);

        DeleteRequestResponse response = courseTermRequestService.approveDeleteRequest(processorId, id);
        return ResponseEntity.ok(response);
    }

    /**
     * 삭제 요청 반려
     * PATCH /api/course-term-requests/delete/{id}/reject
     */
    @PatchMapping("/delete/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<DeleteRequestResponse> rejectDeleteRequest(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody RejectRequestDto request
    ) {
        Long processorId = Long.parseLong(principal.getName());
        log.info("PATCH /api/course-term-requests/delete/{}/reject - processorId: {}", id, processorId);

        DeleteRequestResponse response = courseTermRequestService.rejectDeleteRequest(processorId, id, request);
        return ResponseEntity.ok(response);
    }
}
