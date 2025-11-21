package com.example.demo.domain.iis.entity;

import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "instructor_info")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class InstructorInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userKey;  // User ID (필수)

    @Column(nullable = false)
    private LocalDateTime timeKey;  // 기록 생성 시점 타임스탬프 (필수)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_id", nullable = false)
    private CourseTerm term;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private Integer termNumber;

    // ===== 정적 팩토리 메서드 =====
    public static InstructorInfo create(User user, CourseTerm term, String courseName) {
        InstructorInfo info = new InstructorInfo();
        info.userKey = user.getId();
        info.timeKey = LocalDateTime.now();  // 현재 시간
        info.user = user;
        info.term = term;
        info.courseName = courseName;
        info.termNumber = term.getTermNumber();
        return info;
    }
}
