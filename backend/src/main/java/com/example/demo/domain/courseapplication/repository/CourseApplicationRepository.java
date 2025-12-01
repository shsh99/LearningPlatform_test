package com.example.demo.domain.courseapplication.repository;

import com.example.demo.domain.courseapplication.entity.ApplicationStatus;
import com.example.demo.domain.courseapplication.entity.CourseApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * CourseApplication Repository
 */
public interface CourseApplicationRepository extends JpaRepository<CourseApplication, Long> {

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
}
