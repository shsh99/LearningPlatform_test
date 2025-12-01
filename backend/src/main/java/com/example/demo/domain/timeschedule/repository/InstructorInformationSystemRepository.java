package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.InstructorInformationSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorInformationSystemRepository extends JpaRepository<InstructorInformationSystem, Long> {

    @Query("SELECT DISTINCT iis FROM InstructorInformationSystem iis " +
           "JOIN FETCH iis.assignment a " +
           "JOIN FETCH a.instructor i " +
           "JOIN FETCH a.assignedBy ab " +
           "JOIN FETCH a.term t " +
           "JOIN FETCH t.course c " +
           "WHERE iis.userKey = :userKey " +
           "ORDER BY iis.timestamp DESC")
    List<InstructorInformationSystem> findByUserKey(@Param("userKey") Long userKey);

    @Query("SELECT DISTINCT iis FROM InstructorInformationSystem iis " +
           "JOIN FETCH iis.assignment a " +
           "JOIN FETCH a.instructor i " +
           "JOIN FETCH a.assignedBy ab " +
           "JOIN FETCH a.term t " +
           "JOIN FETCH t.course c " +
           "WHERE iis.timeKey = :timeKey " +
           "ORDER BY iis.timestamp DESC")
    List<InstructorInformationSystem> findByTimeKey(@Param("timeKey") Long timeKey);

    @Query("SELECT DISTINCT iis FROM InstructorInformationSystem iis " +
           "JOIN FETCH iis.assignment a " +
           "JOIN FETCH a.instructor i " +
           "JOIN FETCH a.assignedBy ab " +
           "JOIN FETCH a.term t " +
           "JOIN FETCH t.course c " +
           "WHERE iis.userKey = :userKey AND iis.timeKey = :timeKey " +
           "ORDER BY iis.timestamp DESC")
    List<InstructorInformationSystem> findByUserKeyAndTimeKey(@Param("userKey") Long userKey, @Param("timeKey") Long timeKey);

    @Query("SELECT DISTINCT iis FROM InstructorInformationSystem iis " +
           "JOIN FETCH iis.assignment a " +
           "JOIN FETCH a.instructor i " +
           "JOIN FETCH a.assignedBy ab " +
           "JOIN FETCH a.term t " +
           "JOIN FETCH t.course c " +
           "ORDER BY iis.timestamp DESC")
    List<InstructorInformationSystem> findAllWithDetails();

    /**
     * 테넌트 ID로 IIS 조회 (assignment를 통해 tenantId 필터링)
     */
    @Query("SELECT DISTINCT iis FROM InstructorInformationSystem iis " +
           "JOIN FETCH iis.assignment a " +
           "JOIN FETCH a.instructor i " +
           "JOIN FETCH a.assignedBy ab " +
           "JOIN FETCH a.term t " +
           "JOIN FETCH t.course c " +
           "WHERE a.tenantId = :tenantId " +
           "ORDER BY iis.timestamp DESC")
    List<InstructorInformationSystem> findAllByTenantId(@Param("tenantId") Long tenantId);
}
