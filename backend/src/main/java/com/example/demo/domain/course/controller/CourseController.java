package com.example.demo.domain.course.controller;

import com.example.demo.domain.course.dto.CourseResponse;
import com.example.demo.domain.course.dto.CreateCourseRequest;
import com.example.demo.domain.course.dto.UpdateCourseRequest;
import com.example.demo.domain.course.entity.CourseStatus;
import com.example.demo.domain.course.service.CourseService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Course REST API Controller
 */
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Validated
public class CourseController {

    private final CourseService courseService;

    /**
     * 강의 생성
     * POST /api/courses
     * 권한: OPERATOR 이상
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> createCourse(
        @Valid @RequestBody CreateCourseRequest request) {
        CourseResponse response = courseService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 강의 단건 조회
     * GET /api/courses/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(
        @PathVariable @Positive Long id) {
        CourseResponse response = courseService.findById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 전체 강의 목록 조회
     * GET /api/courses
     */
    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = courseService.findAll();
        return ResponseEntity.ok(courses);
    }

    /**
     * 상태별 강의 목록 조회
     * GET /api/courses/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CourseResponse>> getCoursesByStatus(
        @PathVariable CourseStatus status) {
        List<CourseResponse> courses = courseService.findByStatus(status);
        return ResponseEntity.ok(courses);
    }

    /**
     * 강의 제목으로 검색
     * GET /api/courses/search?keyword=xxx
     */
    @GetMapping("/search")
    public ResponseEntity<List<CourseResponse>> searchCourses(
        @RequestParam String keyword) {
        List<CourseResponse> courses = courseService.searchByTitle(keyword);
        return ResponseEntity.ok(courses);
    }

    /**
     * 강의 수정
     * PATCH /api/courses/{id}
     * 권한: OPERATOR 이상
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> updateCourse(
        @PathVariable @Positive Long id,
        @Valid @RequestBody UpdateCourseRequest request) {
        CourseResponse response = courseService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 강의 삭제
     * DELETE /api/courses/{id}
     * 권한: ADMIN만 가능
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(
        @PathVariable @Positive Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 강의 승인
     * POST /api/courses/{id}/approve
     * 권한: OPERATOR 이상
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> approveCourse(
        @PathVariable @Positive Long id) {
        CourseResponse response = courseService.approve(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 강의 거부
     * POST /api/courses/{id}/reject
     * 권한: OPERATOR 이상
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> rejectCourse(
        @PathVariable @Positive Long id) {
        CourseResponse response = courseService.reject(id);
        return ResponseEntity.ok(response);
    }
}
