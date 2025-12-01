package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.InstructorInformationSystemDetailResponse;
import com.example.demo.domain.timeschedule.dto.InstructorInformationSystemResponse;
import com.example.demo.domain.timeschedule.repository.InstructorInformationSystemRepository;
import com.example.demo.global.tenant.TenantContext;
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
        Long tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            return iisRepository.findAllByTenantId(tenantId).stream()
                .map(InstructorInformationSystemResponse::from)
                .collect(Collectors.toList());
        }
        return iisRepository.findAll().stream()
            .map(InstructorInformationSystemResponse::from)
            .collect(Collectors.toList());
    }

    // Enhanced methods with detailed information
    @Override
    public List<InstructorInformationSystemDetailResponse> findAllDetailed() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            return iisRepository.findAllByTenantId(tenantId).stream()
                .map(InstructorInformationSystemDetailResponse::from)
                .collect(Collectors.toList());
        }
        return iisRepository.findAllWithDetails().stream()
            .map(InstructorInformationSystemDetailResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<InstructorInformationSystemDetailResponse> findByUserKeyDetailed(Long userKey) {
        return iisRepository.findByUserKey(userKey).stream()
            .map(InstructorInformationSystemDetailResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<InstructorInformationSystemDetailResponse> findByTimeKeyDetailed(Long timeKey) {
        return iisRepository.findByTimeKey(timeKey).stream()
            .map(InstructorInformationSystemDetailResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<InstructorInformationSystemDetailResponse> findByUserKeyAndTimeKeyDetailed(Long userKey, Long timeKey) {
        return iisRepository.findByUserKeyAndTimeKey(userKey, timeKey).stream()
            .map(InstructorInformationSystemDetailResponse::from)
            .collect(Collectors.toList());
    }
}
