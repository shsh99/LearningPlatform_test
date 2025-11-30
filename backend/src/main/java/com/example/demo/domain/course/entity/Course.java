package com.example.demo.domain.course.entity;

import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.global.common.BaseTimeEntity;
import com.example.demo.global.tenant.TenantAware;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "courses")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@EntityListeners(com.example.demo.global.tenant.TenantEntityListener.class)
public class Course extends BaseTimeEntity implements TenantAware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    private Tenant tenant;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer maxStudents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CourseStatus status;

    // ===== 정적 팩토리 메서드 =====
    public static Course create(String title, String description, Integer maxStudents) {
        Course course = new Course();
        course.title = title;
        course.description = description;
        course.maxStudents = maxStudents;
        course.status = CourseStatus.APPROVED;
        return course;
    }

    public static Course create(String title, String description, Integer maxStudents, Long tenantId) {
        Course course = new Course();
        course.title = title;
        course.description = description;
        course.maxStudents = maxStudents;
        course.status = CourseStatus.APPROVED;
        course.tenantId = tenantId;
        return course;
    }

    // ===== 비즈니스 메서드 =====
    public void update(String title, String description, Integer maxStudents) {
        this.title = title;
        this.description = description;
        this.maxStudents = maxStudents;
    }

    public void approve() {
        this.status = CourseStatus.APPROVED;
    }

    public void reject() {
        this.status = CourseStatus.REJECTED;
    }
}
