package com.example.demo.domain.course.repository;

import com.example.demo.domain.course.entity.CourseApplication;
import com.example.demo.domain.course.entity.ApplicationStatus;
import com.example.demo.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseApplicationRepository extends JpaRepository<CourseApplication, Long> {

    List<CourseApplication> findByApplicant(User applicant);

    List<CourseApplication> findByStatus(ApplicationStatus status);

    List<CourseApplication> findByApplicantAndStatus(User applicant, ApplicationStatus status);
}
