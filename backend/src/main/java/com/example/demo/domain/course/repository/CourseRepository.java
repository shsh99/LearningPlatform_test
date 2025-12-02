package com.example.demo.domain.course.repository;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.entity.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    /**
     * ID와 테넌트 ID로 강의 조회 (크로스 테넌트 접근 방지)
     */
    Optional<Course> findByIdAndTenantId(Long id, Long tenantId);

    List<Course> findByStatus(CourseStatus status);

    List<Course> findByTitleContaining(String keyword);

    /**
     * 테넌트 ID로 강의 목록 조회
     */
    List<Course> findByTenantId(Long tenantId);

    /**
     * 테넌트 ID와 상태로 강의 목록 조회
     */
    List<Course> findByTenantIdAndStatus(Long tenantId, CourseStatus status);

    /**
     * 테넌트 ID로 강의 제목 검색
     */
    @Query("SELECT c FROM Course c WHERE c.tenantId = :tenantId AND LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Course> findByTenantIdAndTitleContaining(@Param("tenantId") Long tenantId, @Param("keyword") String keyword);

    /**
     * 테넌트 ID로 강의 수 카운트 (필터 무시, 직접 쿼리)
     */
    @Query("SELECT COUNT(c) FROM Course c WHERE c.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);

    // ==================== 페이징 메서드 ====================

    /**
     * 테넌트 ID로 강의 목록 페이징 조회
     */
    Page<Course> findByTenantId(Long tenantId, Pageable pageable);

    /**
     * 테넌트 ID와 상태로 강의 목록 페이징 조회
     */
    Page<Course> findByTenantIdAndStatus(Long tenantId, CourseStatus status, Pageable pageable);

    /**
     * 테넌트 ID로 강의 제목 검색 (페이징)
     */
    @Query("SELECT c FROM Course c WHERE c.tenantId = :tenantId " +
           "AND LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Course> searchByTenantIdAndTitle(@Param("tenantId") Long tenantId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 테넌트 ID, 상태, 제목 검색 (페이징)
     */
    @Query("SELECT c FROM Course c WHERE c.tenantId = :tenantId " +
           "AND c.status = :status " +
           "AND LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Course> searchByTenantIdAndStatusAndTitle(
        @Param("tenantId") Long tenantId,
        @Param("status") CourseStatus status,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    /**
     * 상태별 강의 수 카운트
     */
    @Query("SELECT COUNT(c) FROM Course c WHERE c.tenantId = :tenantId AND c.status = :status")
    long countByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") CourseStatus status);

    /**
     * 승인된 강의만 조회 (일반 사용자용, 페이징)
     */
    @Query("SELECT c FROM Course c WHERE c.tenantId = :tenantId AND c.status = 'APPROVED'")
    Page<Course> findApprovedCoursesByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
}
