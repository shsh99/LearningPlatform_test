package com.example.demo.domain.courseapplication.entity;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.user.entity.User;
import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 강의 개설 신청 Entity
 */
@Entity
@Table(name = "course_applications")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CourseApplication extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer maxStudents;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status;

    @Column(length = 500)
    private String rejectionReason;

    // ===== 정적 팩토리 메서드 =====
    public static CourseApplication create(String title, String description, Integer maxStudents, User applicant) {
        CourseApplication application = new CourseApplication();
        application.title = title;
        application.description = description;
        application.maxStudents = maxStudents;
        application.applicant = applicant;
        application.status = ApplicationStatus.PENDING;
        return application;
    }

    // ===== 비즈니스 메서드 =====
    public void approve(Course course) {
        if (this.status != ApplicationStatus.PENDING) {
            throw new IllegalStateException("대기 중인 신청만 승인할 수 있습니다.");
        }
        this.status = ApplicationStatus.APPROVED;
        this.course = course;
    }

    public void reject(String reason) {
        if (this.status != ApplicationStatus.PENDING) {
            throw new IllegalStateException("대기 중인 신청만 거부할 수 있습니다.");
        }
        this.status = ApplicationStatus.REJECTED;
        this.rejectionReason = reason;
    }

    public boolean isPending() {
        return this.status == ApplicationStatus.PENDING;
    }

    public boolean isApproved() {
        return this.status == ApplicationStatus.APPROVED;
    }
}
