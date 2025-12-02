package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.ConflictException;
import com.example.demo.global.exception.ErrorCode;

public class TermHasEnrollmentsException extends ConflictException {

    public TermHasEnrollmentsException() {
        super(ErrorCode.TERM_HAS_ENROLLMENTS);
    }

    public TermHasEnrollmentsException(Long termId, int enrollmentCount) {
        super(ErrorCode.TERM_HAS_ENROLLMENTS,
            String.format("수강생이 %d명 있어 차수를 삭제할 수 없습니다. (차수 ID: %d)",
                enrollmentCount, termId));
    }
}
