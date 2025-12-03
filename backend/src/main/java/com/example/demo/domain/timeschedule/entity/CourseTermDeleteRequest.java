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

import java.time.LocalDateTime;

/**
 * 차수 삭제 요청 Entity
 */
@Entity
@Table(name = "course_term_delete_requests")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@EntityListeners(com.example.demo.global.tenant.TenantEntityListener.class)
public class CourseTermDeleteRequest extends BaseTimeEntity implements TenantAware {

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

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(length = 500)
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_id")
    private User processedBy;

    @Column
    private LocalDateTime processedAt;

    // ===== 정적 팩토리 메서드 =====
    public static CourseTermDeleteRequest create(
            CourseTerm courseTerm,
            User requester,
            String reason
    ) {
        CourseTermDeleteRequest request = new CourseTermDeleteRequest();
        request.tenantId = courseTerm.getTenantId();
        request.courseTerm = courseTerm;
        request.requester = requester;
        request.status = TermRequestStatus.PENDING;
        request.reason = reason;
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
