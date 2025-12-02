package com.example.demo.domain.course.exception;

import com.example.demo.domain.course.entity.CourseStatus;
import com.example.demo.global.exception.BadRequestException;
import com.example.demo.global.exception.ErrorCode;

public class InvalidCourseStatusTransitionException extends BadRequestException {

    public InvalidCourseStatusTransitionException() {
        super(ErrorCode.INVALID_COURSE_STATUS_TRANSITION);
    }

    public InvalidCourseStatusTransitionException(CourseStatus from, CourseStatus to) {
        super(ErrorCode.INVALID_COURSE_STATUS_TRANSITION,
            String.format("강의 상태를 %s에서 %s로 변경할 수 없습니다.", from.name(), to.name()));
    }
}
