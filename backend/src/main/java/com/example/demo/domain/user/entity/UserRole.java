package com.example.demo.domain.user.entity;

public enum UserRole {
    USER,           // 일반 사용자 (수강생)
    INSTRUCTOR,     // 강사
    OPERATOR,       // 운영자
    ADMIN,          // 관리자 (기존 호환성)
    TENANT_ADMIN,   // 테넌트 관리자
    SUPER_ADMIN     // 슈퍼 관리자 (전체 시스템 관리)
}
