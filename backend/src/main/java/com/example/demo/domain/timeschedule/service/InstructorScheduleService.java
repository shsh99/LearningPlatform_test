package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.InstructorScheduleResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * 강사 시간표 조회 서비스
 */
public interface InstructorScheduleService {

    /**
     * 강사의 모든 배정된 시간표 조회
     */
    List<InstructorScheduleResponse> getInstructorSchedules(Long instructorId);

    /**
     * 강사의 특정 기간 시간표 조회
     */
    List<InstructorScheduleResponse> getInstructorSchedulesByDateRange(Long instructorId, LocalDate startDate, LocalDate endDate);

    /**
     * 강사의 특정 차수 시간표 조회
     */
    InstructorScheduleResponse getInstructorScheduleByTerm(Long instructorId, Long termId);

    /**
     * 강사의 오늘 시간표 조회
     */
    List<InstructorScheduleResponse.ScheduleItem> getInstructorTodaySchedules(Long instructorId);
}
