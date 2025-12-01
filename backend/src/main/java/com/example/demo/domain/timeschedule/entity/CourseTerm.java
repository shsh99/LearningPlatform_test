package com.example.demo.domain.timeschedule.entity;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.global.common.BaseTimeEntity;
import com.example.demo.global.tenant.TenantAware;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "course_terms")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@EntityListeners(com.example.demo.global.tenant.TenantEntityListener.class)
public class CourseTerm extends BaseTimeEntity implements TenantAware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Integer termNumber;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "course_term_days", joinColumns = @JoinColumn(name = "course_term_id"))
    @Column(name = "day_of_week")
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> daysOfWeek = new HashSet<>();

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

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
            Set<DayOfWeek> daysOfWeek,
            LocalTime startTime,
            LocalTime endTime,
            Integer maxStudents
    ) {
        CourseTerm term = new CourseTerm();
        term.course = course;
        term.tenantId = course.getTenantId(); // 과정의 tenantId 상속
        term.termNumber = termNumber;
        term.startDate = startDate;
        term.endDate = endDate;
        term.daysOfWeek = new HashSet<>(daysOfWeek);
        term.startTime = startTime;
        term.endTime = endTime;
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

    public void update(
            LocalDate startDate,
            LocalDate endDate,
            Set<DayOfWeek> daysOfWeek,
            LocalTime startTime,
            LocalTime endTime,
            Integer maxStudents
    ) {
        if (this.status != TermStatus.SCHEDULED) {
            throw new IllegalStateException("Only scheduled terms can be updated");
        }
        this.startDate = startDate;
        this.endDate = endDate;
        this.daysOfWeek = new HashSet<>(daysOfWeek);
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxStudents = maxStudents;
    }
}
