package com.example.demo.domain.course.service;

import com.example.demo.domain.course.dto.CourseResponse;
import com.example.demo.domain.course.dto.CreateCourseRequest;
import com.example.demo.domain.course.dto.UpdateCourseRequest;
import com.example.demo.domain.course.entity.CourseStatus;

import java.util.List;

/**
 * Course Service 인터페이스
 */
public interface CourseService {

    /**
     * 강의 생성
     */
    CourseResponse create(CreateCourseRequest request);

    /**
     * 강의 단건 조회
     */
    CourseResponse findById(Long id);

    /**
     * 전체 강의 목록 조회
     */
    List<CourseResponse> findAll();

    /**
     * 상태별 강의 목록 조회
     */
    List<CourseResponse> findByStatus(CourseStatus status);

    /**
     * 강의 제목으로 검색
     */
    List<CourseResponse> searchByTitle(String keyword);

    /**
     * 강의 수정
     */
    CourseResponse update(Long id, UpdateCourseRequest request);

    /**
     * 강의 삭제
     */
    void delete(Long id);

    /**
     * 강의 승인
     */
    CourseResponse approve(Long id);

    /**
     * 강의 거부
     */
    CourseResponse reject(Long id);
}
