package com.example.demo.domain.enrollment.controller;

import com.example.demo.domain.enrollment.dto.StudentInformationSystemDetailResponse;
import com.example.demo.domain.enrollment.service.StudentInformationSystemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-information-system")
@RequiredArgsConstructor
@Slf4j
public class StudentInformationSystemController {

    private final StudentInformationSystemService sisService;

    @GetMapping
    public ResponseEntity<List<StudentInformationSystemDetailResponse>> getAll() {
        log.info("GET /api/student-information-system - Get all with details");
        return ResponseEntity.ok(sisService.findAllWithDetails());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentInformationSystemDetailResponse> getDetail(@PathVariable Long id) {
        log.info("GET /api/student-information-system/{} - Get detail", id);
        return ResponseEntity.ok(sisService.findDetailById(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelEnrollment(@PathVariable Long id) {
        log.info("POST /api/student-information-system/{}/cancel - Cancel enrollment", id);
        sisService.cancelEnrollment(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> completeEnrollment(@PathVariable Long id) {
        log.info("POST /api/student-information-system/{}/complete - Complete enrollment", id);
        sisService.completeEnrollment(id);
        return ResponseEntity.ok().build();
    }
}
