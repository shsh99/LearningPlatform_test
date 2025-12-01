package com.example.demo.domain.course.repository;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

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
}
