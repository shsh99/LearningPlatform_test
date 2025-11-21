package com.example.demo.domain.timeschedule.entity;

import com.example.demo.domain.user.entity.User;
import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "instructor_assignments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class InstructorAssignment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_id", nullable = false)
    private CourseTerm term;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_id", nullable = false)
    private User assignedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssignmentStatus status;

    // ===== 정적 팩토리 메서드 =====
    public static InstructorAssignment create(
            CourseTerm term,
            User instructor,
            User assignedBy
    ) {
        InstructorAssignment assignment = new InstructorAssignment();
        assignment.term = term;
        assignment.instructor = instructor;
        assignment.assignedBy = assignedBy;
        assignment.status = AssignmentStatus.ASSIGNED;
        return assignment;
    }

    // ===== 비즈니스 메서드 =====
    public void cancel() {
        if (this.status == AssignmentStatus.CANCELLED) {
            throw new IllegalStateException("Assignment is already cancelled");
        }
        this.status = AssignmentStatus.CANCELLED;
    }

    public boolean isActive() {
        return this.status == AssignmentStatus.ASSIGNED;
    }
}
