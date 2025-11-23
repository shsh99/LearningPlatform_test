package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.InstructorInformationSystemResponse;
import com.example.demo.domain.timeschedule.repository.InstructorInformationSystemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class InstructorInformationSystemServiceImpl implements InstructorInformationSystemService {

    private final InstructorInformationSystemRepository iisRepository;

    @Override
    public List<InstructorInformationSystemResponse> findByUserKey(Long userKey) {
        return iisRepository.findByUserKey(userKey).stream()
            .map(InstructorInformationSystemResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<InstructorInformationSystemResponse> findByTimeKey(Long timeKey) {
        return iisRepository.findByTimeKey(timeKey).stream()
            .map(InstructorInformationSystemResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<InstructorInformationSystemResponse> findByUserKeyAndTimeKey(Long userKey, Long timeKey) {
        return iisRepository.findByUserKeyAndTimeKey(userKey, timeKey).stream()
            .map(InstructorInformationSystemResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<InstructorInformationSystemResponse> findAll() {
        return iisRepository.findAll().stream()
            .map(InstructorInformationSystemResponse::from)
            .collect(Collectors.toList());
    }
}
