package com.example.demo.domain.course.exception;

import com.example.demo.global.exception.ConflictException;
import com.example.demo.global.exception.ErrorCode;

public class CourseAlreadyApprovedException extends ConflictException {

    public CourseAlreadyApprovedException() {
        super(ErrorCode.COURSE_ALREADY_APPROVED);
    }

    public CourseAlreadyApprovedException(Long courseId) {
        super(ErrorCode.COURSE_ALREADY_APPROVED,
            String.format("이미 승인된 강의입니다. (ID: %d)", courseId));
    }
}
