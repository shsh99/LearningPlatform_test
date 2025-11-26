package com.example.demo.domain.enrollment.service;

import com.example.demo.domain.enrollment.dto.StudentInformationSystemDetailResponse;
import com.example.demo.domain.enrollment.dto.StudentInformationSystemResponse;

import java.util.List;

public interface StudentInformationSystemService {

    List<StudentInformationSystemResponse> findByUserKey(Long userKey);

    List<StudentInformationSystemResponse> findByTimeKey(Long timeKey);

    List<StudentInformationSystemResponse> findByUserKeyAndTimeKey(Long userKey, Long timeKey);

    List<StudentInformationSystemResponse> findAll();

    List<StudentInformationSystemDetailResponse> findAllWithDetails();

    StudentInformationSystemDetailResponse findDetailById(Long id);

    void cancelEnrollment(Long id);

    void completeEnrollment(Long id);
}
