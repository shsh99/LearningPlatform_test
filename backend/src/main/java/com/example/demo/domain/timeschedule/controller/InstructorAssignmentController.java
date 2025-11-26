package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.AssignInstructorRequest;
import com.example.demo.domain.timeschedule.dto.InstructorAssignmentResponse;
import com.example.demo.domain.timeschedule.service.InstructorAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/instructor-assignments")
@RequiredArgsConstructor
@Slf4j
public class InstructorAssignmentController {

    private final InstructorAssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<InstructorAssignmentResponse> assignInstructor(@Valid @RequestBody AssignInstructorRequest request) {
        log.info("POST /api/instructor-assignments - termId: {}, instructorId: {}", request.termId(), request.instructorId());
        InstructorAssignmentResponse response = assignmentService.assignInstructor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstructorAssignmentResponse> getAssignmentById(@PathVariable Long id) {
        log.info("GET /api/instructor-assignments/{}", id);
        InstructorAssignmentResponse response = assignmentService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/term/{termId}")
    public ResponseEntity<List<InstructorAssignmentResponse>> getAssignmentsByTermId(@PathVariable Long termId) {
        log.info("GET /api/instructor-assignments/term/{}", termId);
        List<InstructorAssignmentResponse> response = assignmentService.findByTermId(termId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<InstructorAssignmentResponse>> getAssignmentsByInstructorId(@PathVariable Long instructorId) {
        log.info("GET /api/instructor-assignments/instructor/{}", instructorId);
        List<InstructorAssignmentResponse> response = assignmentService.findByInstructorId(instructorId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<InstructorAssignmentResponse>> getAllAssignments() {
        log.info("GET /api/instructor-assignments");
        List<InstructorAssignmentResponse> response = assignmentService.findAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/schedule/{instructorId}")
    public ResponseEntity<List<InstructorAssignmentResponse>> getInstructorSchedule(
            @PathVariable Long instructorId,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth
    ) {
        // yearMonth가 없으면 현재 월로 기본값 설정
        YearMonth targetMonth = (yearMonth != null) ? yearMonth : YearMonth.now();
        log.info("GET /api/instructor-assignments/schedule/{} - yearMonth: {}", instructorId, targetMonth);
        List<InstructorAssignmentResponse> response = assignmentService.findInstructorSchedule(instructorId, targetMonth);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAssignment(@PathVariable Long id) {
        log.info("DELETE /api/instructor-assignments/{}", id);
        assignmentService.cancelAssignment(id);
        return ResponseEntity.ok().build();
    }
}
