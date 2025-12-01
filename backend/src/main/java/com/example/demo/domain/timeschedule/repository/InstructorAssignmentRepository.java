package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.AssignmentStatus;
import com.example.demo.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstructorAssignmentRepository extends JpaRepository<InstructorAssignment, Long> {

    List<InstructorAssignment> findByInstructor(User instructor);

    List<InstructorAssignment> findByTerm(CourseTerm term);

    Optional<InstructorAssignment> findByTermAndStatus(CourseTerm term, AssignmentStatus status);

    List<InstructorAssignment> findByInstructorAndStatus(User instructor, AssignmentStatus status);

    boolean existsByTermAndStatus(CourseTerm term, AssignmentStatus status);

    /**
     * 테넌트 ID로 강사 배정 목록 조회
     */
    List<InstructorAssignment> findByTenantId(Long tenantId);
}
