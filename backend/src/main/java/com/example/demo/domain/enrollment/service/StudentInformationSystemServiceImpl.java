package com.example.demo.domain.enrollment.service;

import com.example.demo.domain.enrollment.dto.StudentInformationSystemDetailResponse;
import com.example.demo.domain.enrollment.dto.StudentInformationSystemResponse;
import com.example.demo.domain.enrollment.repository.StudentInformationSystemRepository;
import com.example.demo.global.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        Long tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            return sisRepository.findAllByTenantId(tenantId).stream()
                .map(StudentInformationSystemResponse::from)
                .collect(Collectors.toList());
        }
        return sisRepository.findAll().stream()
            .map(StudentInformationSystemResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public List<StudentInformationSystemDetailResponse> findAllWithDetails() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            return sisRepository.findAllByTenantId(tenantId).stream()
                .map(StudentInformationSystemDetailResponse::from)
                .collect(Collectors.toList());
        }
        return sisRepository.findAllWithDetails().stream()
            .map(StudentInformationSystemDetailResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public Page<StudentInformationSystemDetailResponse> findAllWithDetailsPaged(Pageable pageable) {
        return sisRepository.findAllWithDetailsPaged(pageable)
            .map(StudentInformationSystemDetailResponse::from);
    }

    @Override
    public StudentInformationSystemDetailResponse findDetailById(Long id) {
        var sis = sisRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new IllegalArgumentException("SIS not found with id: " + id));
        return StudentInformationSystemDetailResponse.from(sis);
    }

    @Override
    @Transactional
    public void cancelEnrollment(Long id) {
        var sis = sisRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new IllegalArgumentException("SIS not found with id: " + id));
        sis.getEnrollment().cancel();
    }

    @Override
    @Transactional
    public void completeEnrollment(Long id) {
        var sis = sisRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new IllegalArgumentException("SIS not found with id: " + id));
        sis.getEnrollment().complete();
    }
}
