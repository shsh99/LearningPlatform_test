package com.example.demo.domain.enrollment.repository;

import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

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
}
