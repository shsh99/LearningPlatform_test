package com.example.demo.domain.timeschedule.exception;

import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.global.exception.BadRequestException;
import com.example.demo.global.exception.ErrorCode;

public class InvalidTermStatusTransitionException extends BadRequestException {

    public InvalidTermStatusTransitionException() {
        super(ErrorCode.INVALID_TERM_STATUS_TRANSITION);
    }

    public InvalidTermStatusTransitionException(TermStatus from, TermStatus to) {
        super(ErrorCode.INVALID_TERM_STATUS_TRANSITION,
            String.format("차수 상태를 %s에서 %s로 변경할 수 없습니다.", from.name(), to.name()));
    }
}
