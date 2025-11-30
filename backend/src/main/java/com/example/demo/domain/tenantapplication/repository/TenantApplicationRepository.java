package com.example.demo.domain.tenantapplication.repository;

import com.example.demo.domain.tenantapplication.entity.ApplicationStatus;
import com.example.demo.domain.tenantapplication.entity.TenantApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TenantApplicationRepository extends JpaRepository<TenantApplication, Long> {

    /**
     * 회사 코드로 신청 조회
     */
    Optional<TenantApplication> findByCompanyCode(String companyCode);

    /**
     * 담당자 이메일로 신청 조회
     */
    Optional<TenantApplication> findByAdminEmail(String adminEmail);

    /**
     * 회사 코드 존재 여부 확인
     */
    boolean existsByCompanyCode(String companyCode);

    /**
     * 담당자 이메일 존재 여부 확인
     */
    boolean existsByAdminEmail(String adminEmail);

    /**
     * 상태별 신청 목록 조회
     */
    List<TenantApplication> findAllByStatusOrderByCreatedAtDesc(ApplicationStatus status);

    /**
     * 모든 신청 목록 조회 (최신순)
     */
    List<TenantApplication> findAllByOrderByCreatedAtDesc();
}
