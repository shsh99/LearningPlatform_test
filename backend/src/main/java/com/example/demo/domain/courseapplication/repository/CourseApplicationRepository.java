package com.example.demo.domain.courseapplication.repository;

import com.example.demo.domain.courseapplication.entity.ApplicationStatus;
import com.example.demo.domain.courseapplication.entity.CourseApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * CourseApplication Repository
 */
public interface CourseApplicationRepository extends JpaRepository<CourseApplication, Long>, JpaSpecificationExecutor<CourseApplication> {

    /**
     * 신청자별 강의 개설 신청 목록 조회 (N+1 방지)
     */
    @Query("SELECT ca FROM CourseApplication ca JOIN FETCH ca.applicant WHERE ca.applicant.id = :applicantId")
    List<CourseApplication> findByApplicantId(@Param("applicantId") Long applicantId);

    /**
     * 상태별 강의 개설 신청 목록 조회 (N+1 방지)
     */
    @Query("SELECT ca FROM CourseApplication ca JOIN FETCH ca.applicant WHERE ca.status = :status")
    List<CourseApplication> findByStatus(@Param("status") ApplicationStatus status);

    /**
     * 신청자 + 상태별 조회 (N+1 방지)
     */
    @Query("SELECT ca FROM CourseApplication ca JOIN FETCH ca.applicant WHERE ca.applicant.id = :applicantId AND ca.status = :status")
    List<CourseApplication> findByApplicantIdAndStatus(@Param("applicantId") Long applicantId, @Param("status") ApplicationStatus status);

    /**
     * 테넌트 ID로 강의 개설 신청 목록 조회
     */
    @Query("SELECT ca FROM CourseApplication ca JOIN FETCH ca.applicant WHERE ca.tenantId = :tenantId")
    List<CourseApplication> findByTenantId(@Param("tenantId") Long tenantId);

    /**
     * 테넌트 ID와 상태로 강의 개설 신청 목록 조회
     */
    @Query("SELECT ca FROM CourseApplication ca JOIN FETCH ca.applicant WHERE ca.tenantId = :tenantId AND ca.status = :status")
    List<CourseApplication> findByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") ApplicationStatus status);

    // ==================== 페이징 메서드 ====================

    /**
     * 신청자별 강의 개설 신청 목록 페이징 조회
     */
    @Query(value = "SELECT ca FROM CourseApplication ca WHERE ca.applicant.id = :applicantId",
           countQuery = "SELECT COUNT(ca) FROM CourseApplication ca WHERE ca.applicant.id = :applicantId")
    Page<CourseApplication> findByApplicantId(@Param("applicantId") Long applicantId, Pageable pageable);

    /**
     * 상태별 강의 개설 신청 목록 페이징 조회
     */
    @Query(value = "SELECT ca FROM CourseApplication ca WHERE ca.status = :status",
           countQuery = "SELECT COUNT(ca) FROM CourseApplication ca WHERE ca.status = :status")
    Page<CourseApplication> findByStatus(@Param("status") ApplicationStatus status, Pageable pageable);

    /**
     * 테넌트 ID로 강의 개설 신청 목록 페이징 조회
     */
    @Query(value = "SELECT ca FROM CourseApplication ca WHERE ca.tenantId = :tenantId",
           countQuery = "SELECT COUNT(ca) FROM CourseApplication ca WHERE ca.tenantId = :tenantId")
    Page<CourseApplication> findByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);

    /**
     * 테넌트 ID와 상태로 강의 개설 신청 목록 페이징 조회
     */
    @Query(value = "SELECT ca FROM CourseApplication ca WHERE ca.tenantId = :tenantId AND ca.status = :status",
           countQuery = "SELECT COUNT(ca) FROM CourseApplication ca WHERE ca.tenantId = :tenantId AND ca.status = :status")
    Page<CourseApplication> findByTenantIdAndStatus(
        @Param("tenantId") Long tenantId,
        @Param("status") ApplicationStatus status,
        Pageable pageable
    );

    /**
     * 테넌트 ID와 강의명으로 검색 (페이징)
     */
    @Query(value = "SELECT ca FROM CourseApplication ca " +
           "WHERE ca.tenantId = :tenantId " +
           "AND LOWER(ca.title) LIKE LOWER(CONCAT('%', :keyword, '%'))",
           countQuery = "SELECT COUNT(ca) FROM CourseApplication ca " +
           "WHERE ca.tenantId = :tenantId " +
           "AND LOWER(ca.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<CourseApplication> searchByTenantIdAndTitle(
        @Param("tenantId") Long tenantId,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    /**
     * 테넌트 ID로 강의 개설 신청 수 카운트
     */
    @Query("SELECT COUNT(ca) FROM CourseApplication ca WHERE ca.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);

    /**
     * 테넌트 ID와 상태로 강의 개설 신청 수 카운트
     */
    @Query("SELECT COUNT(ca) FROM CourseApplication ca WHERE ca.tenantId = :tenantId AND ca.status = :status")
    long countByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") ApplicationStatus status);
}
