package com.example.demo.domain.timeschedule.entity;

import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.user.entity.User;
import com.example.demo.global.common.BaseTimeEntity;
import com.example.demo.global.tenant.TenantAware;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

/**
 * 차수 변경 요청 Entity
 */
@Entity
@Table(name = "course_term_change_requests")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@EntityListeners(com.example.demo.global.tenant.TenantEntityListener.class)
public class CourseTermChangeRequest extends BaseTimeEntity implements TenantAware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_term_id", nullable = false)
    private CourseTerm courseTerm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TermRequestStatus status;

    // ===== Before 스냅샷 (요청 시점 데이터) =====
    @Column(nullable = false)
    private LocalDate beforeStartDate;

    @Column(nullable = false)
    private LocalDate beforeEndDate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "change_request_before_days", joinColumns = @JoinColumn(name = "request_id"))
    @Column(name = "day_of_week")
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> beforeDaysOfWeek = new HashSet<>();

    @Column(nullable = false)
    private LocalTime beforeStartTime;

    @Column(nullable = false)
    private LocalTime beforeEndTime;

    @Column(nullable = false)
    private Integer beforeMaxStudents;

    // ===== After 스냅샷 (변경 요청 데이터) =====
    @Column(nullable = false)
    private LocalDate afterStartDate;

    @Column(nullable = false)
    private LocalDate afterEndDate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "change_request_after_days", joinColumns = @JoinColumn(name = "request_id"))
    @Column(name = "day_of_week")
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> afterDaysOfWeek = new HashSet<>();

    @Column(nullable = false)
    private LocalTime afterStartTime;

    @Column(nullable = false)
    private LocalTime afterEndTime;

    @Column(nullable = false)
    private Integer afterMaxStudents;

    // ===== 메타 정보 =====
    @Column(length = 500)
    private String reason;

    @Column
    private Integer affectedStudentCount;

    @Column(length = 500)
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_id")
    private User processedBy;

    @Column
    private LocalDateTime processedAt;

    // ===== 정적 팩토리 메서드 =====
    public static CourseTermChangeRequest create(
            CourseTerm courseTerm,
            User requester,
            LocalDate afterStartDate,
            LocalDate afterEndDate,
            Set<DayOfWeek> afterDaysOfWeek,
            LocalTime afterStartTime,
            LocalTime afterEndTime,
            Integer afterMaxStudents,
            String reason,
            Integer affectedStudentCount
    ) {
        CourseTermChangeRequest request = new CourseTermChangeRequest();
        request.tenantId = courseTerm.getTenantId();
        request.courseTerm = courseTerm;
        request.requester = requester;
        request.status = TermRequestStatus.PENDING;

        // Before 스냅샷 저장
        request.beforeStartDate = courseTerm.getStartDate();
        request.beforeEndDate = courseTerm.getEndDate();
        request.beforeDaysOfWeek = new HashSet<>(courseTerm.getDaysOfWeek());
        request.beforeStartTime = courseTerm.getStartTime();
        request.beforeEndTime = courseTerm.getEndTime();
        request.beforeMaxStudents = courseTerm.getMaxStudents();

        // After 스냅샷 저장
        request.afterStartDate = afterStartDate;
        request.afterEndDate = afterEndDate;
        request.afterDaysOfWeek = new HashSet<>(afterDaysOfWeek);
        request.afterStartTime = afterStartTime;
        request.afterEndTime = afterEndTime;
        request.afterMaxStudents = afterMaxStudents;

        request.reason = reason;
        request.affectedStudentCount = affectedStudentCount;

        return request;
    }

    // ===== 비즈니스 메서드 =====
    public void approve(User processor) {
        if (this.status != TermRequestStatus.PENDING) {
            throw new IllegalStateException("대기 중인 요청만 승인할 수 있습니다.");
        }
        this.status = TermRequestStatus.APPROVED;
        this.processedBy = processor;
        this.processedAt = LocalDateTime.now();
    }

    public void reject(User processor, String rejectionReason) {
        if (this.status != TermRequestStatus.PENDING) {
            throw new IllegalStateException("대기 중인 요청만 반려할 수 있습니다.");
        }
        this.status = TermRequestStatus.REJECTED;
        this.rejectionReason = rejectionReason;
        this.processedBy = processor;
        this.processedAt = LocalDateTime.now();
    }

    public void cancel() {
        if (this.status != TermRequestStatus.PENDING) {
            throw new IllegalStateException("대기 중인 요청만 취소할 수 있습니다.");
        }
        this.status = TermRequestStatus.CANCELLED;
    }

    public boolean isPending() {
        return this.status == TermRequestStatus.PENDING;
    }
}
