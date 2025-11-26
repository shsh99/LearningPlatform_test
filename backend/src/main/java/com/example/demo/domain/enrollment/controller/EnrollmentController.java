package com.example.demo.domain.enrollment.controller;

import com.example.demo.domain.enrollment.dto.CreateEnrollmentRequest;
import com.example.demo.domain.enrollment.dto.DirectEnrollmentRequest;
import com.example.demo.domain.enrollment.dto.EnrollmentResponse;
import com.example.demo.domain.enrollment.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@Slf4j
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    /**
     * 수강 신청 생성
     * POST /api/enrollments
     */
    @PostMapping
    public ResponseEntity<EnrollmentResponse> createEnrollment(@Valid @RequestBody CreateEnrollmentRequest request) {
        log.info("POST /api/enrollments - termId: {}, studentId: {}", request.termId(), request.studentId());
        EnrollmentResponse response = enrollmentService.createEnrollment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 관리자의 직접 수강 신청
     * POST /api/enrollments/direct
     * 권한: OPERATOR 이상
     */
    @PostMapping("/direct")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<EnrollmentResponse> directEnrollment(@Valid @RequestBody DirectEnrollmentRequest request) {
        log.info("POST /api/enrollments/direct - userId: {}, termId: {}", request.userId(), request.termId());
        EnrollmentResponse response = enrollmentService.directEnrollment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 수강 신청 단건 조회
     * GET /api/enrollments/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponse> getEnrollmentById(@PathVariable Long id) {
        log.info("GET /api/enrollments/{}", id);
        EnrollmentResponse response = enrollmentService.findById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 학생별 수강 신청 목록 조회
     * GET /api/enrollments/student/{studentId}
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByStudent(@PathVariable Long studentId) {
        log.info("GET /api/enrollments/student/{}", studentId);
        List<EnrollmentResponse> response = enrollmentService.findByStudentId(studentId);
        return ResponseEntity.ok(response);
    }

    /**
     * 차수별 수강 신청 목록 조회
     * GET /api/enrollments/term/{termId}
     */
    @GetMapping("/term/{termId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByTerm(@PathVariable Long termId) {
        log.info("GET /api/enrollments/term/{}", termId);
        List<EnrollmentResponse> response = enrollmentService.findByTermId(termId);
        return ResponseEntity.ok(response);
    }

    /**
     * 학생별 + 상태별 수강 신청 목록 조회
     * GET /api/enrollments/student/{studentId}/status/{status}
     */
    @GetMapping("/student/{studentId}/status/{status}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByStudentAndStatus(
        @PathVariable Long studentId,
        @PathVariable String status
    ) {
        log.info("GET /api/enrollments/student/{}/status/{}", studentId, status);
        List<EnrollmentResponse> response = enrollmentService.findByStudentIdAndStatus(studentId, status);
        return ResponseEntity.ok(response);
    }

    /**
     * 수강 취소
     * DELETE /api/enrollments/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelEnrollment(@PathVariable Long id) {
        log.info("DELETE /api/enrollments/{}", id);
        enrollmentService.cancelEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 수강 완료 처리
     * POST /api/enrollments/{id}/complete
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<EnrollmentResponse> completeEnrollment(@PathVariable Long id) {
        log.info("POST /api/enrollments/{}/complete", id);
        EnrollmentResponse response = enrollmentService.completeEnrollment(id);
        return ResponseEntity.ok(response);
    }
}
