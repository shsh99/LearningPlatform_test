package com.example.demo.domain.notice.entity;

/**
 * 공지 타입
 */
public enum NoticeType {
    SYSTEM,  // 시스템 공지 (SUPER_ADMIN -> TENANT_ADMIN)
    TENANT   // 테넌트 공지 (TENANT_ADMIN -> 테넌트 사용자)
}
