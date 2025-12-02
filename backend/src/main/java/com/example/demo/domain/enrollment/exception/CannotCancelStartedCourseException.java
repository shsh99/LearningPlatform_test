package com.example.demo.domain.enrollment.exception;

import com.example.demo.global.exception.BadRequestException;
import com.example.demo.global.exception.ErrorCode;

import java.time.LocalDate;

public class CannotCancelStartedCourseException extends BadRequestException {

    public CannotCancelStartedCourseException() {
        super(ErrorCode.CANNOT_CANCEL_STARTED_COURSE);
    }

    public CannotCancelStartedCourseException(LocalDate startDate) {
        super(ErrorCode.CANNOT_CANCEL_STARTED_COURSE,
            String.format("이미 시작된 강의는 취소할 수 없습니다. (시작일: %s)", startDate));
    }
}
