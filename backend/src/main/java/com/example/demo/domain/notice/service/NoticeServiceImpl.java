package com.example.demo.domain.notice.service;

import com.example.demo.domain.notice.dto.CreateNoticeRequest;
import com.example.demo.domain.notice.dto.NoticeResponse;
import com.example.demo.domain.notice.dto.UpdateNoticeRequest;
import com.example.demo.domain.notice.entity.Notice;
import com.example.demo.domain.notice.entity.NoticeType;
import com.example.demo.domain.notice.exception.NoticeNotFoundException;
import com.example.demo.domain.notice.repository.NoticeRepository;
import com.example.demo.global.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 공지 서비스 구현체
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;

    @Override
    @Transactional
    public NoticeResponse create(CreateNoticeRequest request, Long createdBy) {
        log.info("Creating notice: type={}, title={}", request.type(), request.title());

        Notice notice;
        if (request.type() == NoticeType.SYSTEM) {
            notice = Notice.createSystemNotice(
                    request.title(),
                    request.content(),
                    request.startDate(),
                    request.endDate(),
                    createdBy
            );
        } else {
            // TENANT 타입인 경우 TenantContext에서 tenantId를 가져옴
            Long tenantId = request.tenantId() != null ? request.tenantId() : TenantContext.getTenantId();
            notice = Notice.createTenantNotice(
                    tenantId,
                    request.title(),
                    request.content(),
                    request.startDate(),
                    request.endDate(),
                    createdBy
            );
        }

        Notice savedNotice = noticeRepository.save(notice);
        log.info("Notice created: id={}", savedNotice.getId());

        return NoticeResponse.from(savedNotice);
    }

    @Override
    public NoticeResponse findById(Long id) {
        log.debug("Finding notice: id={}", id);
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException(id));
        return NoticeResponse.from(notice);
    }

    @Override
    public Page<NoticeResponse> findSystemNotices(Pageable pageable) {
        log.debug("Finding system notices");
        return noticeRepository.findByType(NoticeType.SYSTEM, pageable)
                .map(NoticeResponse::from);
    }

    @Override
    public Page<NoticeResponse> findTenantNotices(Long tenantId, Pageable pageable) {
        log.debug("Finding tenant notices: tenantId={}", tenantId);
        return noticeRepository.findByTypeAndTenantId(NoticeType.TENANT, tenantId, pageable)
                .map(NoticeResponse::from);
    }

    @Override
    public List<NoticeResponse> findActiveSystemNotices() {
        log.debug("Finding active system notices");
        LocalDateTime now = LocalDateTime.now();
        return noticeRepository.findActiveSystemNotices(now).stream()
                .map(NoticeResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<NoticeResponse> findActiveTenantNotices(Long tenantId) {
        log.debug("Finding active tenant notices: tenantId={}", tenantId);
        LocalDateTime now = LocalDateTime.now();
        return noticeRepository.findActiveTenantNotices(tenantId, now).stream()
                .map(NoticeResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NoticeResponse update(Long id, UpdateNoticeRequest request) {
        log.info("Updating notice: id={}", id);

        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException(id));

        if (request.title() != null && request.content() != null) {
            notice.update(
                    request.title(),
                    request.content(),
                    request.startDate(),
                    request.endDate()
            );
        }

        if (request.enabled() != null) {
            if (request.enabled()) {
                notice.enable();
            } else {
                notice.disable();
            }
        }

        log.info("Notice updated: id={}", id);
        return NoticeResponse.from(notice);
    }

    @Override
    @Transactional
    public NoticeResponse enable(Long id) {
        log.info("Enabling notice: id={}", id);

        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException(id));
        notice.enable();

        log.info("Notice enabled: id={}", id);
        return NoticeResponse.from(notice);
    }

    @Override
    @Transactional
    public NoticeResponse disable(Long id) {
        log.info("Disabling notice: id={}", id);

        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException(id));
        notice.disable();

        log.info("Notice disabled: id={}", id);
        return NoticeResponse.from(notice);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.info("Deleting notice: id={}", id);

        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException(id));
        noticeRepository.delete(notice);

        log.info("Notice deleted: id={}", id);
    }
}
