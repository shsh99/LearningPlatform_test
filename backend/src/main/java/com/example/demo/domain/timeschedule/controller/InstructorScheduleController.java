package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.InstructorScheduleResponse;
import com.example.demo.domain.timeschedule.service.InstructorScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 강사 시간표 조회 API
 */
@RestController
@RequestMapping("/api/instructors")
@RequiredArgsConstructor
@Slf4j
public class InstructorScheduleController {

    private final InstructorScheduleService instructorScheduleService;

    /**
     * 강사의 모든 배정된 시간표 조회
     */
    @GetMapping("/{instructorId}/schedules")
    public ResponseEntity<List<InstructorScheduleResponse>> getInstructorSchedules(
            @PathVariable Long instructorId) {
        log.info("Getting schedules for instructor: {}", instructorId);
        List<InstructorScheduleResponse> schedules = instructorScheduleService.getInstructorSchedules(instructorId);
        return ResponseEntity.ok(schedules);
    }

    /**
     * 강사의 특정 기간 시간표 조회
     */
    @GetMapping("/{instructorId}/schedules/range")
    public ResponseEntity<List<InstructorScheduleResponse>> getInstructorSchedulesByDateRange(
            @PathVariable Long instructorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Getting schedules for instructor {} between {} and {}", instructorId, startDate, endDate);
        List<InstructorScheduleResponse> schedules = instructorScheduleService.getInstructorSchedulesByDateRange(instructorId, startDate, endDate);
        return ResponseEntity.ok(schedules);
    }

    /**
     * 강사의 특정 차수 시간표 조회
     */
    @GetMapping("/{instructorId}/schedules/terms/{termId}")
    public ResponseEntity<InstructorScheduleResponse> getInstructorScheduleByTerm(
            @PathVariable Long instructorId,
            @PathVariable Long termId) {
        log.info("Getting schedule for instructor {} in term {}", instructorId, termId);
        InstructorScheduleResponse schedule = instructorScheduleService.getInstructorScheduleByTerm(instructorId, termId);
        return ResponseEntity.ok(schedule);
    }

    /**
     * 강사의 오늘 시간표 조회
     */
    @GetMapping("/{instructorId}/schedules/today")
    public ResponseEntity<List<InstructorScheduleResponse.ScheduleItem>> getInstructorTodaySchedules(
            @PathVariable Long instructorId) {
        log.info("Getting today's schedules for instructor: {}", instructorId);
        List<InstructorScheduleResponse.ScheduleItem> schedules = instructorScheduleService.getInstructorTodaySchedules(instructorId);
        return ResponseEntity.ok(schedules);
    }
}
