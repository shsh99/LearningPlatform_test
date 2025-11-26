package com.example.demo.domain.enrollment.entity;

import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.user.entity.User;
import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 수강신청 Entity
 */
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
        Enrollment enrollment = new Enrollment();
        enrollment.term = term;
        enrollment.student = student;
        enrollment.status = EnrollmentStatus.ENROLLED;
        return enrollment;
    }

    /**
     * 관리자의 직접 등록 (ENROLLED 상태로 바로 생성)
     */
    public static Enrollment createEnrolled(User student, CourseTerm term) {
        Enrollment enrollment = new Enrollment();
        enrollment.student = student;
        enrollment.term = term;
        enrollment.status = EnrollmentStatus.ENROLLED;
        return enrollment;
    }

    // ===== 비즈니스 메서드 =====
    public void cancel() {
        if (this.status == EnrollmentStatus.CANCELLED) {
            throw new IllegalStateException("Enrollment is already cancelled");
        }
        if (this.status == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel completed enrollment");
        }
        this.status = EnrollmentStatus.CANCELLED;
    }

    public void complete() {
        if (this.status == EnrollmentStatus.CANCELLED) {
            throw new IllegalStateException("Cannot complete cancelled enrollment");
        }
        if (this.status == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Enrollment is already completed");
        }
        this.status = EnrollmentStatus.COMPLETED;
    }

    public boolean isActive() {
        return this.status == EnrollmentStatus.ENROLLED;
    }
}
