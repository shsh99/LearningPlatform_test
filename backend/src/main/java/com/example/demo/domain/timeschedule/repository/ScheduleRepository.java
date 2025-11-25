package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.DayOfWeekEnum;
import com.example.demo.domain.timeschedule.entity.Schedule;
import com.example.demo.domain.timeschedule.entity.ScheduleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // ===== Query Methods =====
    List<Schedule> findByTermId(Long termId);

    List<Schedule> findByTermIdAndWeekNumber(Long termId, Integer weekNumber);

    List<Schedule> findByClassRoomId(Long classRoomId);

    List<Schedule> findByScheduleDateBetween(LocalDate startDate, LocalDate endDate);

    List<Schedule> findByTermIdAndScheduleType(Long termId, ScheduleType scheduleType);

    // ===== Fetch Join =====
    @Query("SELECT s FROM Schedule s JOIN FETCH s.term WHERE s.id = :id")
    Schedule findByIdWithTerm(@Param("id") Long id);

    @Query("SELECT s FROM Schedule s JOIN FETCH s.term LEFT JOIN FETCH s.classRoom WHERE s.term.id = :termId")
    List<Schedule> findByTermIdWithDetails(@Param("termId") Long termId);

    // ===== 충돌 검증용 =====
    @Query("""
        SELECT s FROM Schedule s
        WHERE s.classRoom.id = :classRoomId
        AND s.scheduleDate = :scheduleDate
        AND s.scheduleType != 'CANCELLED'
        """)
    List<Schedule> findByClassRoomIdAndScheduleDate(
            @Param("classRoomId") Long classRoomId,
            @Param("scheduleDate") LocalDate scheduleDate
    );

    @Query("""
        SELECT s FROM Schedule s
        JOIN s.term t
        JOIN com.example.demo.domain.timeschedule.entity.InstructorAssignment ia ON ia.term.id = t.id
        WHERE ia.instructor.id = :instructorId
        AND s.scheduleDate = :scheduleDate
        AND s.scheduleType != 'CANCELLED'
        """)
    List<Schedule> findByInstructorIdAndScheduleDate(
            @Param("instructorId") Long instructorId,
            @Param("scheduleDate") LocalDate scheduleDate
    );

    // ===== 날짜 범위 조회 =====
    @Query("""
        SELECT s FROM Schedule s
        JOIN FETCH s.term t
        LEFT JOIN FETCH s.classRoom
        WHERE s.scheduleDate BETWEEN :startDate AND :endDate
        ORDER BY s.scheduleDate, s.startTime
        """)
    List<Schedule> findByDateRangeWithDetails(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // ===== 특정 요일 조회 =====
    List<Schedule> findByTermIdAndDayOfWeek(Long termId, DayOfWeekEnum dayOfWeek);

    // ===== 차수별 + 날짜 범위 조회 =====
    @Query("""
        SELECT s FROM Schedule s
        JOIN FETCH s.term t
        LEFT JOIN FETCH s.classRoom
        WHERE s.term.id = :termId
        AND s.scheduleDate BETWEEN :startDate AND :endDate
        ORDER BY s.scheduleDate, s.startTime
        """)
    List<Schedule> findByTermIdAndDateRange(
            @Param("termId") Long termId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
