package com.example.demo.domain.enrollment.repository;

import com.example.demo.domain.enrollment.entity.StudentInformationSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentInformationSystemRepository extends JpaRepository<StudentInformationSystem, Long> {

    List<StudentInformationSystem> findByUserKey(Long userKey);

    List<StudentInformationSystem> findByTimeKey(Long timeKey);

    List<StudentInformationSystem> findByUserKeyAndTimeKey(Long userKey, Long timeKey);
}
