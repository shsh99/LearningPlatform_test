package com.example.demo.domain.notice.service;

import com.example.demo.domain.notice.dto.CreateNoticeRequest;
import com.example.demo.domain.notice.dto.NoticeResponse;
import com.example.demo.domain.notice.dto.UpdateNoticeRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 공지 서비스 인터페이스
 */
public interface NoticeService {

    /**
     * 공지 생성
     */
    NoticeResponse create(CreateNoticeRequest request, Long createdBy);

    /**
     * 공지 단건 조회
     */
    NoticeResponse findById(Long id);

    /**
     * 시스템 공지 목록 조회 (SUPER_ADMIN 관리용)
     */
    Page<NoticeResponse> findSystemNotices(Pageable pageable);

    /**
     * 테넌트 공지 목록 조회 (TENANT_ADMIN 관리용)
     */
    Page<NoticeResponse> findTenantNotices(Long tenantId, Pageable pageable);

    /**
     * 현재 활성화된 시스템 공지 조회 (TENANT_ADMIN에게 표시)
     */
    List<NoticeResponse> findActiveSystemNotices();

    /**
     * 현재 활성화된 테넌트 공지 조회 (테넌트 사용자에게 표시)
     */
    List<NoticeResponse> findActiveTenantNotices(Long tenantId);

    /**
     * 공지 수정
     */
    NoticeResponse update(Long id, UpdateNoticeRequest request);

    /**
     * 공지 활성화
     */
    NoticeResponse enable(Long id);

    /**
     * 공지 비활성화
     */
    NoticeResponse disable(Long id);

    /**
     * 공지 삭제
     */
    void delete(Long id);
}
