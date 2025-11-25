package com.example.demo.domain.timeschedule.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Schedule extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_id", nullable = false)
    private CourseTerm term;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id")
    private ClassRoom classRoom;

    @Column(nullable = false)
    private Integer weekNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DayOfWeekEnum dayOfWeek;

    @Column(nullable = false)
    private LocalDate scheduleDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ScheduleType scheduleType;

    @Column(length = 500)
    private String note;

    // ===== 정적 팩토리 메서드 =====
    public static Schedule create(
            CourseTerm term,
            Integer weekNumber,
            DayOfWeekEnum dayOfWeek,
            LocalDate scheduleDate,
            LocalTime startTime,
            LocalTime endTime
    ) {
        validateTimeRange(startTime, endTime);

        Schedule schedule = new Schedule();
        schedule.term = term;
        schedule.weekNumber = weekNumber;
        schedule.dayOfWeek = dayOfWeek;
        schedule.scheduleDate = scheduleDate;
        schedule.startTime = startTime;
        schedule.endTime = endTime;
        schedule.scheduleType = ScheduleType.REGULAR;
        return schedule;
    }

    // ===== 비즈니스 메서드 =====
    public void assignClassRoom(ClassRoom classRoom) {
        this.classRoom = classRoom;
    }

    public void removeClassRoom() {
        this.classRoom = null;
    }

    public void updateTime(LocalTime newStartTime, LocalTime newEndTime) {
        validateTimeRange(newStartTime, newEndTime);
        this.startTime = newStartTime;
        this.endTime = newEndTime;
    }

    public void updateScheduleDate(LocalDate newDate, DayOfWeekEnum newDayOfWeek) {
        if (newDate == null) {
            throw new IllegalArgumentException("일정 날짜는 필수입니다");
        }
        this.scheduleDate = newDate;
        this.dayOfWeek = newDayOfWeek;
    }

    public void markAsMakeup(String note) {
        this.scheduleType = ScheduleType.MAKEUP;
        this.note = note;
    }

    public void markAsCancelled(String reason) {
        this.scheduleType = ScheduleType.CANCELLED;
        this.note = reason;
    }

    public void markAsRegular() {
        this.scheduleType = ScheduleType.REGULAR;
        this.note = null;
    }

    public void updateNote(String note) {
        this.note = note;
    }

    public boolean isOverlapping(LocalTime otherStart, LocalTime otherEnd) {
        return !(this.endTime.isBefore(otherStart) || this.endTime.equals(otherStart)
                || this.startTime.isAfter(otherEnd) || this.startTime.equals(otherEnd));
    }

    public boolean isCancelled() {
        return this.scheduleType == ScheduleType.CANCELLED;
    }

    // ===== Private 검증 메서드 =====
    private static void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("시작/종료 시간은 필수입니다");
        }
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("시작 시간은 종료 시간보다 빨라야 합니다");
        }
    }
}
