package com.example.demo.domain.sis.repository;

import com.example.demo.domain.sis.entity.StudentInfo;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentInfoRepository extends JpaRepository<StudentInfo, Long> {

    List<StudentInfo> findByUserKey(Long userKey);

    List<StudentInfo> findByUser(User user);

    Optional<StudentInfo> findByUserAndTerm(User user, CourseTerm term);

    List<StudentInfo> findByTerm(CourseTerm term);
}
