package com.example.demo.domain.enrollment.exception;

import com.example.demo.global.exception.ConflictException;
import com.example.demo.global.exception.ErrorCode;

public class TermCapacityExceededException extends ConflictException {

    public TermCapacityExceededException() {
        super(ErrorCode.TERM_CAPACITY_EXCEEDED);
    }

    public TermCapacityExceededException(Long termId, int capacity, int enrolled) {
        super(ErrorCode.TERM_CAPACITY_EXCEEDED,
            String.format("수강 정원이 초과되었습니다. (차수 ID: %d, 정원: %d, 현재 등록: %d)",
                termId, capacity, enrolled));
    }
}
