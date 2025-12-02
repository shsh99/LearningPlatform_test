package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.BadRequestException;
import com.example.demo.global.exception.ErrorCode;

import java.time.LocalDate;

public class InvalidTermDateRangeException extends BadRequestException {

    public InvalidTermDateRangeException() {
        super(ErrorCode.INVALID_TERM_DATE_RANGE);
    }

    public InvalidTermDateRangeException(LocalDate startDate, LocalDate endDate) {
        super(ErrorCode.INVALID_TERM_DATE_RANGE,
            String.format("시작일(%s)이 종료일(%s)보다 늦을 수 없습니다.", startDate, endDate));
    }
}
