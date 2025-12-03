package com.example.demo.domain.notice.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 공지 엔티티
 */
@Entity
@Table(name = "notices")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Notice extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NoticeType type;

    @Column(name = "tenant_id")
    private Long tenantId;  // TENANT 타입인 경우 해당 테넌트 ID, SYSTEM이면 null

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Boolean enabled;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;  // 작성자 ID

    private Notice(NoticeType type, Long tenantId, String title, String content,
                   LocalDateTime startDate, LocalDateTime endDate, Long createdBy) {
        this.type = type;
        this.tenantId = tenantId;
        this.title = title;
        this.content = content;
        this.enabled = true;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdBy = createdBy;
    }

    /**
     * 시스템 공지 생성 (SUPER_ADMIN -> TENANT_ADMIN)
     */
    public static Notice createSystemNotice(String title, String content,
                                            LocalDateTime startDate, LocalDateTime endDate,
                                            Long createdBy) {
        return new Notice(NoticeType.SYSTEM, null, title, content, startDate, endDate, createdBy);
    }

    /**
     * 테넌트 공지 생성 (TENANT_ADMIN -> 테넌트 사용자)
     */
    public static Notice createTenantNotice(Long tenantId, String title, String content,
                                            LocalDateTime startDate, LocalDateTime endDate,
                                            Long createdBy) {
        return new Notice(NoticeType.TENANT, tenantId, title, content, startDate, endDate, createdBy);
    }

    public void update(String title, String content, LocalDateTime startDate, LocalDateTime endDate) {
        this.title = title;
        this.content = content;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public void enable() {
        this.enabled = true;
    }

    public void disable() {
        this.enabled = false;
    }

    /**
     * 현재 시점에서 공지가 활성화되어 표시되어야 하는지 확인
     */
    public boolean isActiveNow() {
        if (!enabled) return false;

        LocalDateTime now = LocalDateTime.now();

        // startDate가 있고 아직 시작 전이면 false
        if (startDate != null && now.isBefore(startDate)) return false;

        // endDate가 있고 이미 종료되었으면 false
        if (endDate != null && now.isAfter(endDate)) return false;

        return true;
    }
}
