package com.example.demo.domain.course.repository;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByStatus(CourseStatus status);

    List<Course> findByTitleContaining(String keyword);
}
