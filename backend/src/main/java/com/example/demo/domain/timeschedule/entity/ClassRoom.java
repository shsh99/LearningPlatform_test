package com.example.demo.domain.timeschedule.entity;

import com.example.demo.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "classrooms")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ClassRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 200)
    private String location;

    @Column(nullable = false)
    private Integer capacity;

    @Column(length = 500)
    private String facilities;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClassRoomStatus status;

    // ===== 정적 팩토리 메서드 =====
    public static ClassRoom create(String name, String location, Integer capacity) {
        validateName(name);
        validateCapacity(capacity);

        ClassRoom classRoom = new ClassRoom();
        classRoom.name = name;
        classRoom.location = location;
        classRoom.capacity = capacity;
        classRoom.status = ClassRoomStatus.AVAILABLE;
        return classRoom;
    }

    // ===== 비즈니스 메서드 =====
    public void updateInfo(String name, String location, Integer capacity) {
        validateName(name);
        validateCapacity(capacity);
        this.name = name;
        this.location = location;
        this.capacity = capacity;
    }

    public void updateFacilities(String facilities) {
        this.facilities = facilities;
    }

    public void markAsAvailable() {
        this.status = ClassRoomStatus.AVAILABLE;
    }

    public void markAsMaintenance() {
        this.status = ClassRoomStatus.MAINTENANCE;
    }

    public void markAsUnavailable() {
        this.status = ClassRoomStatus.UNAVAILABLE;
    }

    public boolean isAvailable() {
        return this.status == ClassRoomStatus.AVAILABLE;
    }

    // ===== Private 검증 메서드 =====
    private static void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("강의실 이름은 필수입니다");
        }
    }

    private static void validateCapacity(Integer capacity) {
        if (capacity == null || capacity <= 0) {
            throw new IllegalArgumentException("수용 인원은 1명 이상이어야 합니다");
        }
    }
}
