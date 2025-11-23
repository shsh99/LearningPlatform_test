package com.example.demo.domain.course.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Course extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
        course.status = CourseStatus.APPROVED;  // 승인된 강의
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
