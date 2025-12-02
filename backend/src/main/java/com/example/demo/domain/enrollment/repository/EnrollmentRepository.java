package com.example.demo.domain.enrollment.repository;

import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.user.entity.User;
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
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>, JpaSpecificationExecutor<Enrollment> {

    List<Enrollment> findByStudent(User student);

    List<Enrollment> findByStudentAndStatus(User student, EnrollmentStatus status);

    List<Enrollment> findByTerm(CourseTerm term);

    Optional<Enrollment> findByTermAndStudent(CourseTerm term, User student);

    boolean existsByTermAndStudent(CourseTerm term, User student);

    long countByTermAndStatus(CourseTerm term, EnrollmentStatus status);

    @Query("SELECT e FROM Enrollment e " +
           "JOIN FETCH e.term t " +
           "JOIN FETCH t.course c " +
           "WHERE e.student = :student " +
           "AND e.status = :status")
    List<Enrollment> findEnrollmentsWithCourseByStudentAndStatus(
        @Param("student") User student,
        @Param("status") EnrollmentStatus status
    );

    @Query("SELECT e FROM Enrollment e " +
           "JOIN FETCH e.student s " +
           "WHERE e.term = :term " +
           "AND e.status = :status " +
           "ORDER BY e.createdAt DESC")
    List<Enrollment> findEnrollmentsWithStudentByTermAndStatus(
        @Param("term") CourseTerm term,
        @Param("status") EnrollmentStatus status
    );

    // ==================== 페이징 메서드 ====================

    /**
     * 학생별 수강신청 목록 페이징 조회
     */
    Page<Enrollment> findByStudent(User student, Pageable pageable);

    /**
     * 학생과 상태로 수강신청 목록 페이징 조회
     */
    Page<Enrollment> findByStudentAndStatus(User student, EnrollmentStatus status, Pageable pageable);

    /**
     * 차수별 수강신청 목록 페이징 조회
     */
    Page<Enrollment> findByTerm(CourseTerm term, Pageable pageable);

    /**
     * 차수와 상태로 수강신청 목록 페이징 조회
     */
    Page<Enrollment> findByTermAndStatus(CourseTerm term, EnrollmentStatus status, Pageable pageable);

    /**
     * 테넌트 ID로 수강신청 목록 페이징 조회
     */
    @Query("SELECT e FROM Enrollment e " +
           "JOIN e.term t " +
           "WHERE t.tenantId = :tenantId")
    Page<Enrollment> findByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);

    /**
     * 테넌트 ID와 상태로 수강신청 목록 페이징 조회
     */
    @Query("SELECT e FROM Enrollment e " +
           "JOIN e.term t " +
           "WHERE t.tenantId = :tenantId AND e.status = :status")
    Page<Enrollment> findByTenantIdAndStatus(
        @Param("tenantId") Long tenantId,
        @Param("status") EnrollmentStatus status,
        Pageable pageable
    );

    /**
     * 테넌트 ID로 수강신청 수 카운트
     */
    @Query("SELECT COUNT(e) FROM Enrollment e " +
           "JOIN e.term t " +
           "WHERE t.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);

    /**
     * 테넌트 ID와 상태로 수강신청 수 카운트
     */
    @Query("SELECT COUNT(e) FROM Enrollment e " +
           "JOIN e.term t " +
           "WHERE t.tenantId = :tenantId AND e.status = :status")
    long countByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") EnrollmentStatus status);
}
