package com.example.demo.domain.enrollment.service;

import com.example.demo.domain.enrollment.dto.StudentInformationSystemResponse;
import com.example.demo.domain.enrollment.repository.StudentInformationSystemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StudentInformationSystemServiceImpl implements StudentInformationSystemService {

    private final StudentInformationSystemRepository sisRepository;

    @Override
    public List<StudentInformationSystemResponse> findByUserKey(Long userKey) {
        return sisRepository.findByUserKey(userKey).stream()
            .map(StudentInformationSystemResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<StudentInformationSystemResponse> findByTimeKey(Long timeKey) {
        return sisRepository.findByTimeKey(timeKey).stream()
            .map(StudentInformationSystemResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<StudentInformationSystemResponse> findByUserKeyAndTimeKey(Long userKey, Long timeKey) {
        return sisRepository.findByUserKeyAndTimeKey(userKey, timeKey).stream()
            .map(StudentInformationSystemResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<StudentInformationSystemResponse> findAll() {
        return sisRepository.findAll().stream()
            .map(StudentInformationSystemResponse::from)
            .collect(Collectors.toList());
    }
}
