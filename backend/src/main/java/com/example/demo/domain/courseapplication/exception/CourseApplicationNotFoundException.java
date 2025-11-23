package com.example.demo.domain.courseapplication.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

/**
 * 강의 개설 신청을 찾을 수 없을 때 발생하는 예외
 */
public class CourseApplicationNotFoundException extends BusinessException {

    public CourseApplicationNotFoundException() {
        super(ErrorCode.COURSE_APPLICATION_NOT_FOUND, "강의 개설 신청을 찾을 수 없습니다.");
    }

    public CourseApplicationNotFoundException(Long id) {
        super(ErrorCode.COURSE_APPLICATION_NOT_FOUND, "강의 개설 신청을 찾을 수 없습니다. ID: " + id);
    }
}
