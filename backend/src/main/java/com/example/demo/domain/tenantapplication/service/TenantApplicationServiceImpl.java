package com.example.demo.domain.tenantapplication.service;

import com.example.demo.domain.tenant.dto.CreateTenantRequest;
import com.example.demo.domain.tenant.service.TenantService;
import com.example.demo.domain.tenantapplication.dto.*;
import com.example.demo.domain.tenantapplication.entity.ApplicationStatus;
import com.example.demo.domain.tenantapplication.entity.TenantApplication;
import com.example.demo.domain.tenantapplication.repository.TenantApplicationRepository;
import com.example.demo.domain.user.dto.CreateTenantAdminRequest;
import com.example.demo.domain.user.service.UserService;
import com.example.demo.global.exception.DuplicateException;
import com.example.demo.global.exception.NotFoundException;
import com.example.demo.global.exception.ErrorCode;
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
public class TenantApplicationServiceImpl implements TenantApplicationService {

    private final TenantApplicationRepository tenantApplicationRepository;
    private final TenantService tenantService;
    private final UserService userService;

    @Override
    @Transactional
    public TenantApplicationResponse createApplication(CreateTenantApplicationRequest request) {
        log.info("Creating tenant application for company: {}", request.companyName());

        // 1. 중복 검증
        if (tenantApplicationRepository.existsByCompanyCode(request.companyCode())) {
            throw new DuplicateException(ErrorCode.DUPLICATE_RESOURCE);
        }

        if (tenantApplicationRepository.existsByAdminEmail(request.adminEmail())) {
            throw new DuplicateException(ErrorCode.DUPLICATE_RESOURCE);
        }

        // 2. 신청 생성
        TenantApplication application = TenantApplication.create(
                request.companyName(),
                request.companyCode(),
                request.adminName(),
                request.adminEmail(),
                request.phoneNumber(),
                request.businessNumber(),
                request.description()
        );

        TenantApplication saved = tenantApplicationRepository.save(application);
        log.info("Tenant application created: id={}, companyCode={}", saved.getId(), saved.getCompanyCode());

        return TenantApplicationResponse.from(saved);
    }

    @Override
    public List<TenantApplicationResponse> getAllApplications() {
        return tenantApplicationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(TenantApplicationResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<TenantApplicationResponse> getApplicationsByStatus(ApplicationStatus status) {
        return tenantApplicationRepository.findAllByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(TenantApplicationResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<TenantApplicationResponse> getPendingApplications() {
        return getApplicationsByStatus(ApplicationStatus.PENDING);
    }

    @Override
    public TenantApplicationResponse getApplication(Long applicationId) {
        TenantApplication application = tenantApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.APPLICATION_NOT_FOUND));

        return TenantApplicationResponse.from(application);
    }

    @Override
    @Transactional
    public TenantApplicationResponse approveApplication(
            Long applicationId,
            ApproveApplicationRequest request,
            Long approvedBy
    ) {
        log.info("Approving tenant application: id={}, approvedBy={}", applicationId, approvedBy);

        // 1. 신청 조회 및 검증
        TenantApplication application = tenantApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.APPLICATION_NOT_FOUND));

        if (!application.isPending()) {
            throw new IllegalStateException("이미 처리된 신청입니다.");
        }

        // 2. 테넌트 생성 (code, name, domain)
        CreateTenantRequest tenantRequest = new CreateTenantRequest(
                application.getCompanyCode(),
                application.getCompanyName(),
                null  // domain은 나중에 설정 가능
        );

        var createdTenant = tenantService.createTenant(tenantRequest);
        log.info("Tenant created: id={}, code={}", createdTenant.id(), createdTenant.code());

        // 3. 테넌트 어드민 계정 생성
        CreateTenantAdminRequest adminRequest = new CreateTenantAdminRequest(
                createdTenant.id(),
                application.getAdminEmail(),
                request.initialPassword(),
                application.getAdminName()
        );

        var createdAdmin = userService.createTenantAdmin(adminRequest);
        log.info("Tenant admin created: id={}, email={}", createdAdmin.id(), createdAdmin.email());

        // 4. 신청 승인 처리
        application.approve(approvedBy);
        TenantApplication approved = tenantApplicationRepository.save(application);

        log.info("Tenant application approved: id={}, tenantId={}", approved.getId(), createdTenant.id());

        return TenantApplicationResponse.from(approved);
    }

    @Override
    @Transactional
    public TenantApplicationResponse rejectApplication(
            Long applicationId,
            RejectApplicationRequest request,
            Long rejectedBy
    ) {
        log.info("Rejecting tenant application: id={}, rejectedBy={}", applicationId, rejectedBy);

        // 1. 신청 조회 및 검증
        TenantApplication application = tenantApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.APPLICATION_NOT_FOUND));

        if (!application.isPending()) {
            throw new IllegalStateException("이미 처리된 신청입니다.");
        }

        // 2. 신청 거절 처리
        application.reject(request.rejectionReason(), rejectedBy);
        TenantApplication rejected = tenantApplicationRepository.save(application);

        log.info("Tenant application rejected: id={}, reason={}", rejected.getId(), request.rejectionReason());

        return TenantApplicationResponse.from(rejected);
    }
}
