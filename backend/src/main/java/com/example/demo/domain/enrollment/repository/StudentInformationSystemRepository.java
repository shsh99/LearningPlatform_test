package com.example.demo.domain.enrollment.repository;

import com.example.demo.domain.enrollment.entity.StudentInformationSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentInformationSystemRepository extends JpaRepository<StudentInformationSystem, Long> {

    List<StudentInformationSystem> findByUserKey(Long userKey);

    List<StudentInformationSystem> findByTimeKey(Long timeKey);

    List<StudentInformationSystem> findByUserKeyAndTimeKey(Long userKey, Long timeKey);

    @Query("SELECT sis FROM StudentInformationSystem sis " +
           "JOIN FETCH sis.enrollment e " +
           "JOIN FETCH e.student s " +
           "JOIN FETCH e.term t " +
           "JOIN FETCH t.course c")
    List<StudentInformationSystem> findAllWithDetails();

    @Query("SELECT sis FROM StudentInformationSystem sis " +
           "JOIN FETCH sis.enrollment e " +
           "JOIN FETCH e.student s " +
           "JOIN FETCH e.term t " +
           "JOIN FETCH t.course c " +
           "WHERE sis.id = :id")
    Optional<StudentInformationSystem> findByIdWithDetails(@Param("id") Long id);

    /**
     * 테넌트 ID로 SIS 조회 (enrollment를 통해 tenantId 필터링)
     */
    @Query("SELECT sis FROM StudentInformationSystem sis " +
           "JOIN FETCH sis.enrollment e " +
           "JOIN FETCH e.student s " +
           "JOIN FETCH e.term t " +
           "JOIN FETCH t.course c " +
           "WHERE e.tenantId = :tenantId")
    List<StudentInformationSystem> findAllByTenantId(@Param("tenantId") Long tenantId);
}
