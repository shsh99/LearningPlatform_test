package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.CreateScheduleRequest;
import com.example.demo.domain.timeschedule.dto.ScheduleResponse;
import com.example.demo.domain.timeschedule.dto.UpdateScheduleRequest;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

    ScheduleResponse createSchedule(CreateScheduleRequest request);

    ScheduleResponse findById(Long id);

    List<ScheduleResponse> findByTermId(Long termId);

    List<ScheduleResponse> findByTermIdAndWeekNumber(Long termId, Integer weekNumber);

    List<ScheduleResponse> findByDateRange(LocalDate startDate, LocalDate endDate);

    List<ScheduleResponse> findAll();

    ScheduleResponse updateSchedule(Long id, UpdateScheduleRequest request);

    void assignClassRoom(Long scheduleId, Long classRoomId);

    void removeClassRoom(Long scheduleId);

    void markAsCancelled(Long id, String reason);

    void markAsMakeup(Long id, String note);

    void deleteSchedule(Long id);
}
