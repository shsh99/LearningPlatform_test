package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.CourseTermChangeRequest;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.TermRequestStatus;
import com.example.demo.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseTermChangeRequestRepository extends JpaRepository<CourseTermChangeRequest, Long> {

    /**
     * 요청자별 변경 요청 목록 조회 (Fetch Join)
     */
    @Query("SELECT r FROM CourseTermChangeRequest r " +
           "JOIN FETCH r.courseTerm ct " +
           "JOIN FETCH ct.course c " +
           "JOIN FETCH r.requester " +
           "LEFT JOIN FETCH r.processedBy " +
           "WHERE r.requester = :requester " +
           "ORDER BY r.createdAt DESC")
    List<CourseTermChangeRequest> findByRequester(@Param("requester") User requester);

    /**
     * 요청자별 변경 요청 목록 페이징 조회
     */
    Page<CourseTermChangeRequest> findByRequester(User requester, Pageable pageable);

    /**
     * 상태별 변경 요청 목록 조회
     */
    List<CourseTermChangeRequest> findByStatus(TermRequestStatus status);

    /**
     * 상태별 변경 요청 목록 페이징 조회
     */
    Page<CourseTermChangeRequest> findByStatus(TermRequestStatus status, Pageable pageable);

    /**
     * 테넌트 ID와 상태로 변경 요청 목록 조회
     */
    @Query("SELECT r FROM CourseTermChangeRequest r " +
           "JOIN FETCH r.courseTerm ct " +
           "JOIN FETCH ct.course c " +
           "JOIN FETCH r.requester " +
           "WHERE r.tenantId = :tenantId AND r.status = :status " +
           "ORDER BY r.createdAt DESC")
    List<CourseTermChangeRequest> findByTenantIdAndStatusWithDetails(
            @Param("tenantId") Long tenantId,
            @Param("status") TermRequestStatus status
    );

    /**
     * 차수에 대기 중인 변경 요청이 있는지 확인
     */
    boolean existsByCourseTermAndStatus(CourseTerm courseTerm, TermRequestStatus status);

    /**
     * 차수에 대기 중인 변경 요청 조회
     */
    Optional<CourseTermChangeRequest> findByCourseTermAndStatus(CourseTerm courseTerm, TermRequestStatus status);

    /**
     * 요청 상세 조회 (Fetch Join)
     */
    @Query("SELECT r FROM CourseTermChangeRequest r " +
           "JOIN FETCH r.courseTerm ct " +
           "JOIN FETCH ct.course c " +
           "JOIN FETCH r.requester " +
           "LEFT JOIN FETCH r.processedBy " +
           "WHERE r.id = :id")
    Optional<CourseTermChangeRequest> findByIdWithDetails(@Param("id") Long id);

    /**
     * 테넌트별 변경 요청 수 카운트
     */
    @Query("SELECT COUNT(r) FROM CourseTermChangeRequest r WHERE r.tenantId = :tenantId AND r.status = :status")
    long countByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") TermRequestStatus status);
}
