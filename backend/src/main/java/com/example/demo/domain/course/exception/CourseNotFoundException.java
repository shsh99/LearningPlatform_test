package com.example.demo.domain.course.exception;

import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.NotFoundException;

/**
 * 강의를 찾을 수 없을 때 발생하는 예외
 */
public class CourseNotFoundException extends NotFoundException {

    public CourseNotFoundException(Long courseId) {
        super(ErrorCode.COURSE_NOT_FOUND, "강의 ID: " + courseId);
    }

    public CourseNotFoundException() {
        super(ErrorCode.COURSE_NOT_FOUND);
    }
}
