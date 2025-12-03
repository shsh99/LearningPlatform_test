package com.example.demo.domain.timeschedule.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 모집 방식 Enum
 */
@Getter
@RequiredArgsConstructor
public enum EnrollmentType {
    FIRST_COME("선착순"),
    SELECTION("선발");

    private final String description;
}
