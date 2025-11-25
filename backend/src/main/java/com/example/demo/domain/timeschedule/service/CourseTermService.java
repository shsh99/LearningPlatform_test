package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;
import com.example.demo.domain.timeschedule.dto.UpdateCourseTermRequest;

import java.time.LocalDate;
import java.util.List;

public interface CourseTermService {
    CourseTermResponse createTerm(CreateCourseTermRequest request);
    CourseTermResponse updateTerm(Long id, UpdateCourseTermRequest request);
    CourseTermResponse findById(Long id);
    List<CourseTermResponse> findByCourseId(Long courseId);
    List<CourseTermResponse> findAll();
    List<CourseTermResponse> searchByDateRange(LocalDate startDate, LocalDate endDate);
    CourseTermResponse duplicateTerm(Long id, LocalDate newStartDate, LocalDate newEndDate);
    void startTerm(Long id);
    void completeTerm(Long id);
    void cancelTerm(Long id);
}
