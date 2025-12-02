package com.example.demo.domain.enrollment.entity;

import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.global.common.BaseTimeEntity;
import com.example.demo.global.tenant.TenantAware;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

/**
 * SIS (Student Information System)
 * 수강 신청 시 유저키, 타임키, 타임스탬프를 기록
 */
@Entity
@Table(name = "student_information_system")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@EntityListeners(com.example.demo.global.tenant.TenantEntityListener.class)
public class StudentInformationSystem extends BaseTimeEntity implements TenantAware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    private Tenant tenant;

    @Column(name = "user_key", nullable = false)
    private Long userKey;

    @Column(name = "time_key", nullable = false)
    private Long timeKey;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    public static StudentInformationSystem create(Long userKey, Long timeKey, Enrollment enrollment) {
        StudentInformationSystem sis = new StudentInformationSystem();
        sis.userKey = userKey;
        sis.timeKey = timeKey;
        sis.timestamp = LocalDateTime.now();
        sis.enrollment = enrollment;
        sis.tenantId = enrollment.getTenantId(); // Enrollment에서 tenantId 상속
        return sis;
    }

    @Override
    public Long getTenantId() {
        return tenantId;
    }
}
