package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.AssignInstructorRequest;
import com.example.demo.domain.timeschedule.dto.InstructorAssignmentResponse;

import java.util.List;

public interface InstructorAssignmentService {
    InstructorAssignmentResponse assignInstructor(AssignInstructorRequest request);
    InstructorAssignmentResponse findById(Long id);
    List<InstructorAssignmentResponse> findByTermId(Long termId);
    List<InstructorAssignmentResponse> findByInstructorId(Long instructorId);
    List<InstructorAssignmentResponse> findAll();
    void cancelAssignment(Long id);
}
