package com.example.demo.domain.enrollment.controller;

import com.example.demo.domain.enrollment.dto.StudentInformationSystemResponse;
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
    public ResponseEntity<List<StudentInformationSystemResponse>> getAll(
        @RequestParam(required = false) Long userKey,
        @RequestParam(required = false) Long timeKey
    ) {
        log.info("GET /api/student-information-system - userKey: {}, timeKey: {}", userKey, timeKey);

        if (userKey != null && timeKey != null) {
            return ResponseEntity.ok(sisService.findByUserKeyAndTimeKey(userKey, timeKey));
        } else if (userKey != null) {
            return ResponseEntity.ok(sisService.findByUserKey(userKey));
        } else if (timeKey != null) {
            return ResponseEntity.ok(sisService.findByTimeKey(timeKey));
        } else {
            return ResponseEntity.ok(sisService.findAll());
        }
    }
}
