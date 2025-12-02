package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.BadRequestException;
import com.example.demo.global.exception.ErrorCode;

import java.time.LocalDate;

public class TermAlreadyStartedException extends BadRequestException {

    public TermAlreadyStartedException() {
        super(ErrorCode.TERM_ALREADY_STARTED);
    }

    public TermAlreadyStartedException(Long termId, LocalDate startDate) {
        super(ErrorCode.TERM_ALREADY_STARTED,
            String.format("이미 시작된 차수입니다. (차수 ID: %d, 시작일: %s)", termId, startDate));
    }
}
