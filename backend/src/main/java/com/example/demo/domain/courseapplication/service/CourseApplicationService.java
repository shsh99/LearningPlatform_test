package com.example.demo.domain.courseapplication.service;

import com.example.demo.domain.courseapplication.dto.CourseApplicationResponse;
import com.example.demo.domain.courseapplication.dto.CreateCourseApplicationRequest;
import com.example.demo.domain.courseapplication.entity.ApplicationStatus;

import java.util.List;

/**
 * CourseApplication Service Interface
 */
public interface CourseApplicationService {

    /**
     * 강의 개설 신청 생성
     */
    CourseApplicationResponse create(Long applicantId, CreateCourseApplicationRequest request);

    /**
     * 강의 개설 신청 단건 조회
     */
    CourseApplicationResponse findById(Long id);

    /**
     * 신청자별 강의 개설 신청 목록 조회
     */
    List<CourseApplicationResponse> findByApplicantId(Long applicantId);

    /**
     * 상태별 강의 개설 신청 목록 조회
     */
    List<CourseApplicationResponse> findByStatus(ApplicationStatus status);

    /**
     * 신청자 + 상태별 강의 개설 신청 목록 조회
     */
    List<CourseApplicationResponse> findByApplicantIdAndStatus(Long applicantId, ApplicationStatus status);

    /**
     * 전체 강의 개설 신청 목록 조회 (OPERATOR용)
     */
    List<CourseApplicationResponse> findAll();

    /**
     * 강의 개설 신청 승인 (OPERATOR)
     */
    CourseApplicationResponse approve(Long id);

    /**
     * 강의 개설 신청 거부 (OPERATOR)
     */
    CourseApplicationResponse reject(Long id, String reason);

    /**
     * 강의 개설 신청 취소 (본인만 가능)
     */
    void cancel(Long id, Long applicantId);
}
