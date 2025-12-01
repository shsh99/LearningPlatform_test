package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseTermRepository extends JpaRepository<CourseTerm, Long> {

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
}
