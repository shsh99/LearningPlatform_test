package com.example.demo.domain.timeschedule.entity;

import com.example.demo.domain.user.entity.User;
import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "enrollments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Enrollment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_id", nullable = false)
    private CourseTerm term;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnrollmentStatus status;

    // ===== 정적 팩토리 메서드 =====
    public static Enrollment create(CourseTerm term, User student) {
        if (!term.isEnrollable()) {
            throw new IllegalStateException("Term is not enrollable");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.term = term;
        enrollment.student = student;
        enrollment.status = EnrollmentStatus.ENROLLED;

        term.increaseStudentCount();

        return enrollment;
    }

    // ===== 비즈니스 메서드 =====
    public void cancel() {
        if (this.status == EnrollmentStatus.CANCELLED) {
            throw new IllegalStateException("Enrollment is already cancelled");
        }
        if (this.status == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Completed enrollment cannot be cancelled");
        }

        this.status = EnrollmentStatus.CANCELLED;
        this.term.decreaseStudentCount();
    }

    public void complete() {
        if (this.status != EnrollmentStatus.ENROLLED) {
            throw new IllegalStateException("Only enrolled students can complete");
        }
        this.status = EnrollmentStatus.COMPLETED;
    }

    public boolean isActive() {
        return this.status == EnrollmentStatus.ENROLLED;
    }
}
