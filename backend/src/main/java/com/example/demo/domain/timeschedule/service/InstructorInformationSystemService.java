package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.InstructorInformationSystemResponse;

import java.util.List;

public interface InstructorInformationSystemService {

    List<InstructorInformationSystemResponse> findByUserKey(Long userKey);

    List<InstructorInformationSystemResponse> findByTimeKey(Long timeKey);

    List<InstructorInformationSystemResponse> findByUserKeyAndTimeKey(Long userKey, Long timeKey);

    List<InstructorInformationSystemResponse> findAll();
}
