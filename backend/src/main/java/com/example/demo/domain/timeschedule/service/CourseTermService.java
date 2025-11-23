package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;

import java.util.List;

public interface CourseTermService {
    CourseTermResponse createTerm(CreateCourseTermRequest request);
    CourseTermResponse findById(Long id);
    List<CourseTermResponse> findByCourseId(Long courseId);
    List<CourseTermResponse> findAll();
    void startTerm(Long id);
    void completeTerm(Long id);
    void cancelTerm(Long id);
}
