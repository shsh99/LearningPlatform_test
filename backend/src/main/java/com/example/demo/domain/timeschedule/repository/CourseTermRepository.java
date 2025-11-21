package com.example.demo.domain.timeschedule.repository;

import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseTermRepository extends JpaRepository<CourseTerm, Long> {

    List<CourseTerm> findByCourse(Course course);

    List<CourseTerm> findByStatus(TermStatus status);

    Optional<CourseTerm> findByCourseAndTermNumber(Course course, Integer termNumber);

    List<CourseTerm> findByCourseAndStatus(Course course, TermStatus status);
}
