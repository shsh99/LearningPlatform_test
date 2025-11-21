package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.Enrollment;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.EnrollmentStatus;
import com.example.demo.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudent(User student);

    List<Enrollment> findByTerm(CourseTerm term);

    Optional<Enrollment> findByTermAndStudent(CourseTerm term, User student);

    List<Enrollment> findByStudentAndStatus(User student, EnrollmentStatus status);

    List<Enrollment> findByTermAndStatus(CourseTerm term, EnrollmentStatus status);

    boolean existsByTermAndStudentAndStatus(CourseTerm term, User student, EnrollmentStatus status);
}
