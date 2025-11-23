package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.InstructorInformationSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorInformationSystemRepository extends JpaRepository<InstructorInformationSystem, Long> {

    List<InstructorInformationSystem> findByUserKey(Long userKey);

    List<InstructorInformationSystem> findByTimeKey(Long timeKey);

    List<InstructorInformationSystem> findByUserKeyAndTimeKey(Long userKey, Long timeKey);
}
