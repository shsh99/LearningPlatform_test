package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.StudentScheduleResponse;
import com.example.demo.domain.timeschedule.service.StudentScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 수강생 시간표 조회 API
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Slf4j
public class StudentScheduleController {

    private final StudentScheduleService studentScheduleService;

    /**
     * 수강생의 모든 활성 수강 시간표 조회
     */
    @GetMapping("/{studentId}/schedules")
    public ResponseEntity<List<StudentScheduleResponse>> getStudentSchedules(
            @PathVariable Long studentId) {
        log.info("Getting schedules for student: {}", studentId);
        List<StudentScheduleResponse> schedules = studentScheduleService.getStudentSchedules(studentId);
        return ResponseEntity.ok(schedules);
    }

    /**
     * 수강생의 특정 기간 시간표 조회
     */
    @GetMapping("/{studentId}/schedules/range")
    public ResponseEntity<List<StudentScheduleResponse>> getStudentSchedulesByDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Getting schedules for student {} between {} and {}", studentId, startDate, endDate);
        List<StudentScheduleResponse> schedules = studentScheduleService.getStudentSchedulesByDateRange(studentId, startDate, endDate);
        return ResponseEntity.ok(schedules);
    }

    /**
     * 수강생의 특정 차수 시간표 조회
     */
    @GetMapping("/{studentId}/schedules/terms/{termId}")
    public ResponseEntity<StudentScheduleResponse> getStudentScheduleByTerm(
            @PathVariable Long studentId,
            @PathVariable Long termId) {
        log.info("Getting schedule for student {} in term {}", studentId, termId);
        StudentScheduleResponse schedule = studentScheduleService.getStudentScheduleByTerm(studentId, termId);
        return ResponseEntity.ok(schedule);
    }
}
