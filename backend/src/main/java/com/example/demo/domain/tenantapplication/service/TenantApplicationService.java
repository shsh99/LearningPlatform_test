package com.example.demo.domain.tenantapplication.service;

import com.example.demo.domain.tenantapplication.dto.*;
import com.example.demo.domain.tenantapplication.entity.ApplicationStatus;

import java.util.List;

public interface TenantApplicationService {

    /**
     * 테넌트 신청 생성 (비회원)
     */
    TenantApplicationResponse createApplication(CreateTenantApplicationRequest request);

    /**
     * 모든 신청 목록 조회 (SUPER_ADMIN)
     */
    List<TenantApplicationResponse> getAllApplications();

    /**
     * 상태별 신청 목록 조회 (SUPER_ADMIN)
     */
    List<TenantApplicationResponse> getApplicationsByStatus(ApplicationStatus status);

    /**
     * 대기 중인 신청 목록 조회 (SUPER_ADMIN)
     */
    List<TenantApplicationResponse> getPendingApplications();

    /**
     * 신청 상세 조회 (SUPER_ADMIN)
     */
    TenantApplicationResponse getApplication(Long applicationId);

    /**
     * 신청 승인 (SUPER_ADMIN)
     * - 테넌트 생성
     * - 테넌트 어드민 계정 생성
     */
    TenantApplicationResponse approveApplication(Long applicationId, ApproveApplicationRequest request, Long approvedBy);

    /**
     * 신청 거절 (SUPER_ADMIN)
     */
    TenantApplicationResponse rejectApplication(Long applicationId, RejectApplicationRequest request, Long rejectedBy);
}
