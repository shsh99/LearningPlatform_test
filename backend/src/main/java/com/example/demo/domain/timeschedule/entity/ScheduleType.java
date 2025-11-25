package com.example.demo.domain.timeschedule.entity;

public enum ScheduleType {
    REGULAR("정규 수업"),
    MAKEUP("보강"),
    CANCELLED("휴강");

    private final String description;

    ScheduleType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
