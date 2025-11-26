package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.InstructorInformationSystemDetailResponse;
import com.example.demo.domain.timeschedule.dto.InstructorInformationSystemResponse;
import com.example.demo.domain.timeschedule.service.InstructorInformationSystemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor-information-system")
@RequiredArgsConstructor
@Slf4j
public class InstructorInformationSystemController {

    private final InstructorInformationSystemService iisService;

    @GetMapping
    public ResponseEntity<List<InstructorInformationSystemResponse>> getAll(
        @RequestParam(required = false) Long userKey,
        @RequestParam(required = false) Long timeKey
    ) {
        log.info("GET /api/instructor-information-system - userKey: {}, timeKey: {}", userKey, timeKey);

        if (userKey != null && timeKey != null) {
            return ResponseEntity.ok(iisService.findByUserKeyAndTimeKey(userKey, timeKey));
        } else if (userKey != null) {
            return ResponseEntity.ok(iisService.findByUserKey(userKey));
        } else if (timeKey != null) {
            return ResponseEntity.ok(iisService.findByTimeKey(timeKey));
        } else {
            return ResponseEntity.ok(iisService.findAll());
        }
    }

    /**
     * Enhanced endpoint with detailed information (similar to SIS)
     * Returns instructor info, course info, assignment status, etc.
     */
    @GetMapping("/detailed")
    public ResponseEntity<List<InstructorInformationSystemDetailResponse>> getAllDetailed(
        @RequestParam(required = false) Long userKey,
        @RequestParam(required = false) Long timeKey
    ) {
        log.info("GET /api/instructor-information-system/detailed - userKey: {}, timeKey: {}", userKey, timeKey);

        if (userKey != null && timeKey != null) {
            return ResponseEntity.ok(iisService.findByUserKeyAndTimeKeyDetailed(userKey, timeKey));
        } else if (userKey != null) {
            return ResponseEntity.ok(iisService.findByUserKeyDetailed(userKey));
        } else if (timeKey != null) {
            return ResponseEntity.ok(iisService.findByTimeKeyDetailed(timeKey));
        } else {
            return ResponseEntity.ok(iisService.findAllDetailed());
        }
    }
}
