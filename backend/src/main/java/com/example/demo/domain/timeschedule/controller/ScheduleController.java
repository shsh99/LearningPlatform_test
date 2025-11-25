package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.CreateScheduleRequest;
import com.example.demo.domain.timeschedule.dto.ScheduleResponse;
import com.example.demo.domain.timeschedule.dto.UpdateScheduleRequest;
import com.example.demo.domain.timeschedule.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<ScheduleResponse> createSchedule(@Valid @RequestBody CreateScheduleRequest request) {
        ScheduleResponse response = scheduleService.createSchedule(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponse> getSchedule(@PathVariable Long id) {
        ScheduleResponse response = scheduleService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> getAllSchedules() {
        List<ScheduleResponse> responses = scheduleService.findAll();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/term/{termId}")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByTermId(@PathVariable Long termId) {
        List<ScheduleResponse> responses = scheduleService.findByTermId(termId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/term/{termId}/week/{weekNumber}")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByTermAndWeek(
            @PathVariable Long termId,
            @PathVariable Integer weekNumber
    ) {
        List<ScheduleResponse> responses = scheduleService.findByTermIdAndWeekNumber(termId, weekNumber);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<ScheduleResponse> responses = scheduleService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleResponse> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody UpdateScheduleRequest request
    ) {
        ScheduleResponse response = scheduleService.updateSchedule(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/classroom/{classRoomId}")
    public ResponseEntity<Void> assignClassRoom(
            @PathVariable Long id,
            @PathVariable Long classRoomId
    ) {
        scheduleService.assignClassRoom(id, classRoomId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/classroom")
    public ResponseEntity<Void> removeClassRoom(@PathVariable Long id) {
        scheduleService.removeClassRoom(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> markAsCancelled(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        scheduleService.markAsCancelled(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/makeup")
    public ResponseEntity<Void> markAsMakeup(
            @PathVariable Long id,
            @RequestParam(required = false) String note
    ) {
        scheduleService.markAsMakeup(id, note);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
