package com.example.demo.domain.timeschedule.entity;

/**
 * 차수 변경/삭제 요청 상태
 */
public enum TermRequestStatus {
    PENDING,    // 대기 중
    APPROVED,   // 승인됨
    REJECTED,   // 반려됨
    CANCELLED   // 취소됨 (요청자가 취소)
}
