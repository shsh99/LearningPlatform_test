package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.NotFoundException;

/**
 * 차수 요청을 찾을 수 없을 때 발생하는 예외
 */
public class TermRequestNotFoundException extends NotFoundException {

    public TermRequestNotFoundException(Long requestId) {
        super(ErrorCode.TERM_REQUEST_NOT_FOUND, "요청 ID: " + requestId);
    }

    public TermRequestNotFoundException() {
        super(ErrorCode.TERM_REQUEST_NOT_FOUND);
    }
}
