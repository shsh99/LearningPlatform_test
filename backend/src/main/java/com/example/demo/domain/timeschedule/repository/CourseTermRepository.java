package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.course.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseTermRepository extends JpaRepository<CourseTerm, Long>, JpaSpecificationExecutor<CourseTerm> {

    List<CourseTerm> findByCourse(Course course);

    List<CourseTerm> findByStatus(TermStatus status);

    Optional<CourseTerm> findByCourseAndTermNumber(Course course, Integer termNumber);

    List<CourseTerm> findByCourseAndStatus(Course course, TermStatus status);

    List<CourseTerm> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * 테넌트 ID로 차수 목록 조회
     */
    List<CourseTerm> findByTenantId(Long tenantId);

    /**
     * 테넌트 ID로 차수 수 카운트 (필터 무시, 직접 쿼리)
     */
    @Query("SELECT COUNT(ct) FROM CourseTerm ct WHERE ct.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);

    /**
     * 테넌트 ID와 상태로 차수 목록 조회
     */
    List<CourseTerm> findByTenantIdAndStatus(Long tenantId, TermStatus status);

    // ==================== 페이징 메서드 ====================

    /**
     * 강의별 차수 목록 페이징 조회
     */
    Page<CourseTerm> findByCourse(Course course, Pageable pageable);

    /**
     * 상태별 차수 목록 페이징 조회
     */
    Page<CourseTerm> findByStatus(TermStatus status, Pageable pageable);

    /**
     * 강의와 상태로 차수 목록 페이징 조회
     */
    Page<CourseTerm> findByCourseAndStatus(Course course, TermStatus status, Pageable pageable);

    /**
     * 테넌트 ID로 차수 목록 페이징 조회
     */
    Page<CourseTerm> findByTenantId(Long tenantId, Pageable pageable);

    /**
     * 테넌트 ID와 상태로 차수 목록 페이징 조회
     */
    Page<CourseTerm> findByTenantIdAndStatus(Long tenantId, TermStatus status, Pageable pageable);

    /**
     * 기간 내 차수 목록 페이징 조회
     */
    Page<CourseTerm> findByStartDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    /**
     * 테넌트 ID와 기간으로 차수 검색 (페이징)
     */
    @Query("SELECT ct FROM CourseTerm ct WHERE ct.tenantId = :tenantId " +
           "AND ct.startDate >= :startDate AND ct.endDate <= :endDate")
    Page<CourseTerm> findByTenantIdAndDateRange(
        @Param("tenantId") Long tenantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );

    /**
     * 상태별 차수 수 카운트
     */
    @Query("SELECT COUNT(ct) FROM CourseTerm ct WHERE ct.tenantId = :tenantId AND ct.status = :status")
    long countByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") TermStatus status);
}
