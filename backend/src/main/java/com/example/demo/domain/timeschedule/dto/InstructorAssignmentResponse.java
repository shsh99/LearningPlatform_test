package com.example.demo.domain.timeschedule.dto;

import com.example.demo.domain.timeschedule.entity.AssignmentStatus;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;

import java.time.LocalDateTime;

public record InstructorAssignmentResponse(
    Long id,
    Long termId,
    String courseName,
    Integer termNumber,
    Long instructorId,
    String instructorName,
    Long assignedById,
    String assignedByName,
    AssignmentStatus status,
    LocalDateTime createdAt
) {
    public static InstructorAssignmentResponse from(InstructorAssignment assignment) {
        return new InstructorAssignmentResponse(
            assignment.getId(),
            assignment.getTerm().getId(),
            assignment.getTerm().getCourse().getTitle(),
            assignment.getTerm().getTermNumber(),
            assignment.getInstructor().getId(),
            assignment.getInstructor().getName(),
            assignment.getAssignedBy().getId(),
            assignment.getAssignedBy().getName(),
            assignment.getStatus(),
            assignment.getCreatedAt()
        );
    }
}
