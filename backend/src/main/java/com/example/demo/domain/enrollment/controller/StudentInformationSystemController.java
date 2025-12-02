package com.example.demo.domain.enrollment.controller;

import com.example.demo.domain.enrollment.dto.StudentInformationSystemDetailResponse;
import com.example.demo.domain.enrollment.service.StudentInformationSystemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-information-system")
@RequiredArgsConstructor
@Validated
@Slf4j
public class StudentInformationSystemController {

    private final StudentInformationSystemService sisService;

    @GetMapping
    public ResponseEntity<Page<StudentInformationSystemDetailResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        log.info("GET /api/student-information-system - Get all with details (page={}, size={}, sort={}, direction={})",
                page, size, sort, direction);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        return ResponseEntity.ok(sisService.findAllWithDetailsPaged(pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<List<StudentInformationSystemDetailResponse>> getAllWithoutPaging() {
        log.info("GET /api/student-information-system/all - Get all with details (no paging)");
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
