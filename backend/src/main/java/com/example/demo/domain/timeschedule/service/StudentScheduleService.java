package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.StudentScheduleResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * 수강생 시간표 조회 서비스
 */
public interface StudentScheduleService {

    /**
     * 수강생의 모든 활성 수강 시간표 조회
     */
    List<StudentScheduleResponse> getStudentSchedules(Long studentId);

    /**
     * 수강생의 특정 기간 시간표 조회
     */
    List<StudentScheduleResponse> getStudentSchedulesByDateRange(Long studentId, LocalDate startDate, LocalDate endDate);

    /**
     * 수강생의 특정 차수 시간표 조회
     */
    StudentScheduleResponse getStudentScheduleByTerm(Long studentId, Long termId);
}
