package com.example.demo.domain.timeschedule.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * IIS (Instructor Information System)
 * 강사 배정 시 유저키, 타임키, 타임스탬프를 기록
 */
@Entity
@Table(name = "instructor_information_system")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class InstructorInformationSystem extends BaseTimeEntity {

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
    @JoinColumn(name = "assignment_id", nullable = false)
    private InstructorAssignment assignment;

    public static InstructorInformationSystem create(Long userKey, Long timeKey, InstructorAssignment assignment) {
        InstructorInformationSystem iis = new InstructorInformationSystem();
        iis.userKey = userKey;
        iis.timeKey = timeKey;
        iis.timestamp = LocalDateTime.now();
        iis.assignment = assignment;
        return iis;
    }
}
