package com.example.demo.domain.notice.repository;

import com.example.demo.domain.notice.entity.Notice;
import com.example.demo.domain.notice.entity.NoticeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    /**
     * 시스템 공지 목록 조회 (TENANT_ADMIN용)
     */
    Page<Notice> findByType(NoticeType type, Pageable pageable);

    /**
     * 특정 테넌트의 공지 목록 조회
     */
    Page<Notice> findByTypeAndTenantId(NoticeType type, Long tenantId, Pageable pageable);

    /**
     * 현재 활성화된 시스템 공지 조회 (TENANT_ADMIN에게 표시)
     */
    @Query("SELECT n FROM Notice n WHERE n.type = 'SYSTEM' AND n.enabled = true " +
           "AND (n.startDate IS NULL OR n.startDate <= :now) " +
           "AND (n.endDate IS NULL OR n.endDate >= :now) " +
           "ORDER BY n.createdAt DESC")
    List<Notice> findActiveSystemNotices(@Param("now") LocalDateTime now);

    /**
     * 현재 활성화된 테넌트 공지 조회 (테넌트 사용자에게 표시)
     */
    @Query("SELECT n FROM Notice n WHERE n.type = 'TENANT' AND n.tenantId = :tenantId AND n.enabled = true " +
           "AND (n.startDate IS NULL OR n.startDate <= :now) " +
           "AND (n.endDate IS NULL OR n.endDate >= :now) " +
           "ORDER BY n.createdAt DESC")
    List<Notice> findActiveTenantNotices(@Param("tenantId") Long tenantId, @Param("now") LocalDateTime now);

    /**
     * 특정 작성자의 공지 목록 조회
     */
    Page<Notice> findByCreatedBy(Long createdBy, Pageable pageable);
}
