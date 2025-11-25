package com.example.demo.domain.timeschedule.entity;

/**
 * 요일 Enum
 */
public enum DayOfWeek {
    MONDAY("월요일"),
    TUESDAY("화요일"),
    WEDNESDAY("수요일"),
    THURSDAY("목요일"),
    FRIDAY("금요일"),
    SATURDAY("토요일"),
    SUNDAY("일요일");

    private final String description;

    DayOfWeek(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
