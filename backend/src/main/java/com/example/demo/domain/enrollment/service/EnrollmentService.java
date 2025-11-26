package com.example.demo.domain.enrollment.service;

import com.example.demo.domain.enrollment.dto.CreateEnrollmentRequest;
import com.example.demo.domain.enrollment.dto.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {
    /**
     * 수강 신청 생성
     */
    EnrollmentResponse createEnrollment(CreateEnrollmentRequest request);

    /**
     * 수강 신청 단건 조회
     */
    EnrollmentResponse findById(Long id);

    /**
     * 학생별 수강 신청 목록 조회
     */
    List<EnrollmentResponse> findByStudentId(Long studentId);

    /**
     * 차수별 수강 신청 목록 조회
     */
    List<EnrollmentResponse> findByTermId(Long termId);

    /**
     * 학생별 + 상태별 수강 신청 목록 조회
     */
    List<EnrollmentResponse> findByStudentIdAndStatus(Long studentId, String status);

    /**
     * 차수별 + 상태별 수강 신청 목록 조회
     */
    List<EnrollmentResponse> findByTermIdAndStatus(Long termId, String status);

    /**
     * 수강 취소
     */
    void cancelEnrollment(Long id);

    /**
     * 수강 완료 처리
     */
    EnrollmentResponse completeEnrollment(Long id);
}
