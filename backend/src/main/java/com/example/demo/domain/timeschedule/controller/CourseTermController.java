package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;
import com.example.demo.domain.timeschedule.service.CourseTermService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-terms")
@RequiredArgsConstructor
@Slf4j
public class CourseTermController {

    private final CourseTermService courseTermService;

    @PostMapping
    public ResponseEntity<CourseTermResponse> createTerm(@Valid @RequestBody CreateCourseTermRequest request) {
        log.info("POST /api/course-terms - courseId: {}, termNumber: {}", request.courseId(), request.termNumber());
        CourseTermResponse response = courseTermService.createTerm(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseTermResponse> getTermById(@PathVariable Long id) {
        log.info("GET /api/course-terms/{}", id);
        CourseTermResponse response = courseTermService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseTermResponse>> getTermsByCourseId(@PathVariable Long courseId) {
        log.info("GET /api/course-terms/course/{}", courseId);
        List<CourseTermResponse> response = courseTermService.findByCourseId(courseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CourseTermResponse>> getAllTerms() {
        log.info("GET /api/course-terms");
        List<CourseTermResponse> response = courseTermService.findAll();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<Void> startTerm(@PathVariable Long id) {
        log.info("PATCH /api/course-terms/{}/start", id);
        courseTermService.startTerm(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Void> completeTerm(@PathVariable Long id) {
        log.info("PATCH /api/course-terms/{}/complete", id);
        courseTermService.completeTerm(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelTerm(@PathVariable Long id) {
        log.info("PATCH /api/course-terms/{}/cancel", id);
        courseTermService.cancelTerm(id);
        return ResponseEntity.ok().build();
    }
}
