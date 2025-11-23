package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.NotFoundException;

/**
 * 학기를 찾을 수 없을 때 발생하는 예외
 */
public class TermNotFoundException extends NotFoundException {

    public TermNotFoundException(Long termId) {
        super(ErrorCode.TERM_NOT_FOUND, "학기 ID: " + termId);
    }

    public TermNotFoundException() {
        super(ErrorCode.TERM_NOT_FOUND);
    }
}
