package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.ClassRoom;

public record ClassRoomResponse(
        Long id,
        String name,
        String location,
        Integer capacity,
        String facilities,
        String status
) {
    public static ClassRoomResponse from(ClassRoom classRoom) {
        return new ClassRoomResponse(
                classRoom.getId(),
                classRoom.getName(),
                classRoom.getLocation(),
                classRoom.getCapacity(),
                classRoom.getFacilities(),
                classRoom.getStatus().name()
        );
    }
}
