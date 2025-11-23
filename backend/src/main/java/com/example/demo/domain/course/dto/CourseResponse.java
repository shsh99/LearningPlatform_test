package com.example.demo.domain.course.dto;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.entity.CourseStatus;

import java.time.LocalDateTime;

/**
 * 강의 응답 DTO
 */
public record CourseResponse(
    Long id,
    String title,
    String description,
    Integer maxStudents,
    CourseStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    /**
     * Entity → DTO 변환 정적 팩토리 메서드
     */
    public static CourseResponse from(Course course) {
        return new CourseResponse(
            course.getId(),
            course.getTitle(),
            course.getDescription(),
            course.getMaxStudents(),
            course.getStatus(),
            course.getCreatedAt(),
            course.getUpdatedAt()
        );
    }
}
