package com.example.demo.domain.iis.repository;

import com.example.demo.domain.iis.entity.InstructorInfo;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstructorInfoRepository extends JpaRepository<InstructorInfo, Long> {

    List<InstructorInfo> findByUserKey(Long userKey);

    List<InstructorInfo> findByUser(User user);

    Optional<InstructorInfo> findByUserAndTerm(User user, CourseTerm term);

    List<InstructorInfo> findByTerm(CourseTerm term);
}
