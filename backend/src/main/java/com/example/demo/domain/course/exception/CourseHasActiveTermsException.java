package com.example.demo.domain.course.exception;

import com.example.demo.global.exception.ConflictException;
import com.example.demo.global.exception.ErrorCode;

public class CourseHasActiveTermsException extends ConflictException {

    public CourseHasActiveTermsException() {
        super(ErrorCode.COURSE_HAS_ACTIVE_TERMS);
    }

    public CourseHasActiveTermsException(Long courseId, int activeTermCount) {
        super(ErrorCode.COURSE_HAS_ACTIVE_TERMS,
            String.format("진행 중인 차수가 %d개 있어 강의를 삭제할 수 없습니다. (강의 ID: %d)",
                activeTermCount, courseId));
    }
}
