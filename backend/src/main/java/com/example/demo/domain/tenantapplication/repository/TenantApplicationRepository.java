package com.example.demo.domain.tenantapplication.repository;

import com.example.demo.domain.tenantapplication.entity.ApplicationStatus;
import com.example.demo.domain.tenantapplication.entity.TenantApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TenantApplicationRepository extends JpaRepository<TenantApplication, Long>, JpaSpecificationExecutor<TenantApplication> {

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

    // ==================== 페이징 메서드 ====================

    /**
     * 모든 신청 목록 페이징 조회
     */
    Page<TenantApplication> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * 상태별 신청 목록 페이징 조회
     */
    Page<TenantApplication> findByStatusOrderByCreatedAtDesc(ApplicationStatus status, Pageable pageable);

    /**
     * 회사명으로 검색 (페이징)
     */
    @Query("SELECT ta FROM TenantApplication ta " +
           "WHERE LOWER(ta.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY ta.createdAt DESC")
    Page<TenantApplication> searchByCompanyName(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 상태와 회사명으로 검색 (페이징)
     */
    @Query("SELECT ta FROM TenantApplication ta " +
           "WHERE ta.status = :status " +
           "AND LOWER(ta.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY ta.createdAt DESC")
    Page<TenantApplication> searchByStatusAndCompanyName(
        @Param("status") ApplicationStatus status,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    /**
     * 상태별 신청 수 카운트
     */
    long countByStatus(ApplicationStatus status);
}
