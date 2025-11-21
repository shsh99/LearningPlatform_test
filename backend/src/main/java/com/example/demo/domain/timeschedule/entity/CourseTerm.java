package com.example.demo.domain.timeschedule.entity;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "course_terms")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CourseTerm extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Integer termNumber;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private Integer maxStudents;

    @Column(nullable = false)
    private Integer currentStudents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TermStatus status;

    // ===== 정적 팩토리 메서드 =====
    public static CourseTerm create(
            Course course,
            Integer termNumber,
            LocalDate startDate,
            LocalDate endDate,
            Integer maxStudents
    ) {
        CourseTerm term = new CourseTerm();
        term.course = course;
        term.termNumber = termNumber;
        term.startDate = startDate;
        term.endDate = endDate;
        term.maxStudents = maxStudents;
        term.currentStudents = 0;
        term.status = TermStatus.SCHEDULED;
        return term;
    }

    // ===== 비즈니스 메서드 =====
    public void increaseStudentCount() {
        if (this.currentStudents >= this.maxStudents) {
            throw new IllegalStateException("Course term is full");
        }
        this.currentStudents++;
    }

    public void decreaseStudentCount() {
        if (this.currentStudents <= 0) {
            throw new IllegalStateException("No students to remove");
        }
        this.currentStudents--;
    }

    public boolean isEnrollable() {
        return this.status == TermStatus.SCHEDULED
            && this.currentStudents < this.maxStudents;
    }

    public void start() {
        if (this.status != TermStatus.SCHEDULED) {
            throw new IllegalStateException("Only scheduled terms can be started");
        }
        this.status = TermStatus.ONGOING;
    }

    public void complete() {
        if (this.status != TermStatus.ONGOING) {
            throw new IllegalStateException("Only ongoing terms can be completed");
        }
        this.status = TermStatus.COMPLETED;
    }

    public void cancel() {
        if (this.status == TermStatus.COMPLETED) {
            throw new IllegalStateException("Completed terms cannot be cancelled");
        }
        this.status = TermStatus.CANCELLED;
    }
}
