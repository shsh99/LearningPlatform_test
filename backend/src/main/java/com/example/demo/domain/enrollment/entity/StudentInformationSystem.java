package com.example.demo.domain.enrollment.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * SIS (Student Information System)
 * 수강 신청 시 유저키, 타임키, 타임스탬프를 기록
 */
@Entity
@Table(name = "student_information_system")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class StudentInformationSystem extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
        return sis;
    }
}
