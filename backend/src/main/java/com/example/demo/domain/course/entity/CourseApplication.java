package com.example.demo.domain.course.entity;

import com.example.demo.domain.user.entity.User;
import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "course_applications")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CourseApplication extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Column(nullable = false, length = 200)
    private String courseTitle;

    @Column(columnDefinition = "TEXT")
    private String courseDescription;

    @Column(nullable = false)
    private LocalDate requestedStartDate;

    @Column(nullable = false)
    private Integer maxStudents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status;

    // ===== 정적 팩토리 메서드 =====
    public static CourseApplication create(
            User applicant,
            String courseTitle,
            String courseDescription,
            LocalDate requestedStartDate,
            Integer maxStudents
    ) {
        CourseApplication application = new CourseApplication();
        application.applicant = applicant;
        application.courseTitle = courseTitle;
        application.courseDescription = courseDescription;
        application.requestedStartDate = requestedStartDate;
        application.maxStudents = maxStudents;
        application.status = ApplicationStatus.PENDING;
        return application;
    }

    // ===== 비즈니스 메서드 =====
    public void approve() {
        if (this.status != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Only pending applications can be approved");
        }
        this.status = ApplicationStatus.APPROVED;
    }

    public void reject() {
        if (this.status != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Only pending applications can be rejected");
        }
        this.status = ApplicationStatus.REJECTED;
    }

    public boolean isPending() {
        return this.status == ApplicationStatus.PENDING;
    }
}
