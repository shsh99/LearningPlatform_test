package com.example.demo.domain.timeschedule.controller;

import com.example.demo.domain.timeschedule.dto.ClassRoomResponse;
import com.example.demo.domain.timeschedule.dto.CreateClassRoomRequest;
import com.example.demo.domain.timeschedule.dto.UpdateClassRoomRequest;
import com.example.demo.domain.timeschedule.service.ClassRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
@RequiredArgsConstructor
public class ClassRoomController {

    private final ClassRoomService classRoomService;

    @PostMapping
    public ResponseEntity<ClassRoomResponse> createClassRoom(@Valid @RequestBody CreateClassRoomRequest request) {
        ClassRoomResponse response = classRoomService.createClassRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassRoomResponse> getClassRoom(@PathVariable Long id) {
        ClassRoomResponse response = classRoomService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ClassRoomResponse>> getAllClassRooms() {
        List<ClassRoomResponse> responses = classRoomService.findAll();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/available")
    public ResponseEntity<List<ClassRoomResponse>> getAvailableClassRooms() {
        List<ClassRoomResponse> responses = classRoomService.findAvailable();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/available/timeslot")
    public ResponseEntity<List<ClassRoomResponse>> getAvailableClassRoomsForTimeSlot(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime
    ) {
        List<ClassRoomResponse> responses = classRoomService.findAvailableForTimeSlot(date, startTime, endTime);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassRoomResponse> updateClassRoom(
            @PathVariable Long id,
            @Valid @RequestBody UpdateClassRoomRequest request
    ) {
        ClassRoomResponse response = classRoomService.updateClassRoom(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/available")
    public ResponseEntity<Void> markAsAvailable(@PathVariable Long id) {
        classRoomService.markAsAvailable(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/maintenance")
    public ResponseEntity<Void> markAsMaintenance(@PathVariable Long id) {
        classRoomService.markAsMaintenance(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unavailable")
    public ResponseEntity<Void> markAsUnavailable(@PathVariable Long id) {
        classRoomService.markAsUnavailable(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassRoom(@PathVariable Long id) {
        classRoomService.deleteClassRoom(id);
        return ResponseEntity.noContent().build();
    }
}
