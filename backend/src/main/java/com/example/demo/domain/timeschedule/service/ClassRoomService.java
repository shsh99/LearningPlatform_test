package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.ClassRoomResponse;
import com.example.demo.domain.timeschedule.dto.CreateClassRoomRequest;
import com.example.demo.domain.timeschedule.dto.UpdateClassRoomRequest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ClassRoomService {

    ClassRoomResponse createClassRoom(CreateClassRoomRequest request);

    ClassRoomResponse findById(Long id);

    List<ClassRoomResponse> findAll();

    List<ClassRoomResponse> findAvailable();

    List<ClassRoomResponse> findAvailableForTimeSlot(LocalDate date, LocalTime startTime, LocalTime endTime);

    ClassRoomResponse updateClassRoom(Long id, UpdateClassRoomRequest request);

    void markAsAvailable(Long id);

    void markAsMaintenance(Long id);

    void markAsUnavailable(Long id);

    void deleteClassRoom(Long id);
}
