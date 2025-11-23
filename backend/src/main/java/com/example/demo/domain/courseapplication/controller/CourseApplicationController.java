package com.example.demo.domain.courseapplication.controller;

import com.example.demo.domain.courseapplication.dto.CourseApplicationResponse;
import com.example.demo.domain.courseapplication.dto.CreateCourseApplicationRequest;
import com.example.demo.domain.courseapplication.dto.RejectCourseApplicationRequest;
import com.example.demo.domain.courseapplication.entity.ApplicationStatus;
import com.example.demo.domain.courseapplication.service.CourseApplicationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CourseApplication REST API Controller
 */
@RestController
@RequestMapping("/api/course-applications")
@RequiredArgsConstructor
@Validated
public class CourseApplicationController {

    private final CourseApplicationService courseApplicationService;

    /**
     * 강의 개설 신청 생성
     * POST /api/course-applications
     * 권한: 인증된 모든 사용자
     */
    @PostMapping
    public ResponseEntity<CourseApplicationResponse> createApplication(
        @Valid @RequestBody CreateCourseApplicationRequest request,
        Authentication authentication) {
        Long applicantId = Long.parseLong(authentication.getName());
        CourseApplicationResponse response = courseApplicationService.create(applicantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 강의 개설 신청 단건 조회
     * GET /api/course-applications/{id}
     * 권한: 인증된 모든 사용자
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseApplicationResponse> getApplicationById(
        @PathVariable @Positive Long id) {
        CourseApplicationResponse response = courseApplicationService.findById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 내 강의 개설 신청 목록 조회
     * GET /api/course-applications/my
     * 권한: 인증된 모든 사용자
     */
    @GetMapping("/my")
    public ResponseEntity<List<CourseApplicationResponse>> getMyApplications(
        Authentication authentication) {
        Long applicantId = Long.parseLong(authentication.getName());
        List<CourseApplicationResponse> applications = courseApplicationService.findByApplicantId(applicantId);
        return ResponseEntity.ok(applications);
    }

    /**
     * 내 강의 개설 신청 상태별 조회
     * GET /api/course-applications/my/status/{status}
     * 권한: 인증된 모든 사용자
     */
    @GetMapping("/my/status/{status}")
    public ResponseEntity<List<CourseApplicationResponse>> getMyApplicationsByStatus(
        @PathVariable ApplicationStatus status,
        Authentication authentication) {
        Long applicantId = Long.parseLong(authentication.getName());
        List<CourseApplicationResponse> applications =
            courseApplicationService.findByApplicantIdAndStatus(applicantId, status);
        return ResponseEntity.ok(applications);
    }

    /**
     * 전체 강의 개설 신청 목록 조회 (OPERATOR용)
     * GET /api/course-applications
     * 권한: OPERATOR 이상
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<List<CourseApplicationResponse>> getAllApplications() {
        List<CourseApplicationResponse> applications = courseApplicationService.findAll();
        return ResponseEntity.ok(applications);
    }

    /**
     * 상태별 강의 개설 신청 목록 조회 (OPERATOR용)
     * GET /api/course-applications/status/{status}
     * 권한: OPERATOR 이상
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<List<CourseApplicationResponse>> getApplicationsByStatus(
        @PathVariable ApplicationStatus status) {
        List<CourseApplicationResponse> applications = courseApplicationService.findByStatus(status);
        return ResponseEntity.ok(applications);
    }

    /**
     * 강의 개설 신청 승인
     * POST /api/course-applications/{id}/approve
     * 권한: OPERATOR 이상
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<CourseApplicationResponse> approveApplication(
        @PathVariable @Positive Long id) {
        CourseApplicationResponse response = courseApplicationService.approve(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 강의 개설 신청 거부
     * POST /api/course-applications/{id}/reject
     * 권한: OPERATOR 이상
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<CourseApplicationResponse> rejectApplication(
        @PathVariable @Positive Long id,
        @Valid @RequestBody RejectCourseApplicationRequest request) {
        CourseApplicationResponse response = courseApplicationService.reject(id, request.reason());
        return ResponseEntity.ok(response);
    }

    /**
     * 강의 개설 신청 취소 (본인만 가능)
     * DELETE /api/course-applications/{id}
     * 권한: 인증된 모든 사용자 (본인 확인)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelApplication(
        @PathVariable @Positive Long id,
        Authentication authentication) {
        Long applicantId = Long.parseLong(authentication.getName());
        courseApplicationService.cancel(id, applicantId);
        return ResponseEntity.noContent().build();
    }
}
