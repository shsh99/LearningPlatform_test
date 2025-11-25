package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.ClassRoom;
import com.example.demo.domain.timeschedule.entity.ClassRoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {

    // ===== Query Methods =====
    Optional<ClassRoom> findByName(String name);

    List<ClassRoom> findByStatus(ClassRoomStatus status);

    List<ClassRoom> findByCapacityGreaterThanEqual(Integer minCapacity);

    boolean existsByName(String name);

    // ===== 사용 가능한 강의실 조회 =====
    @Query("""
        SELECT c FROM ClassRoom c
        WHERE c.status = 'AVAILABLE'
        AND c.capacity >= :minCapacity
        ORDER BY c.capacity ASC
        """)
    List<ClassRoom> findAvailableByMinCapacity(@Param("minCapacity") Integer minCapacity);

    // ===== 특정 시간대 미사용 강의실 조회 =====
    @Query("""
        SELECT c FROM ClassRoom c
        WHERE c.status = 'AVAILABLE'
        AND c.id NOT IN (
            SELECT s.classRoom.id FROM Schedule s
            WHERE s.classRoom IS NOT NULL
            AND s.scheduleDate = :scheduleDate
            AND s.scheduleType != 'CANCELLED'
            AND NOT (s.endTime <= :startTime OR s.startTime >= :endTime)
        )
        """)
    List<ClassRoom> findAvailableClassRoomsForTimeSlot(
            @Param("scheduleDate") LocalDate scheduleDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    // ===== 통계용 =====
    long countByStatus(ClassRoomStatus status);
}
