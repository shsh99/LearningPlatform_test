package com.example.demo.domain.timeschedule.entity;

public enum ClassRoomStatus {
    AVAILABLE("사용 가능"),
    MAINTENANCE("점검 중"),
    UNAVAILABLE("사용 불가");

    private final String description;

    ClassRoomStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
