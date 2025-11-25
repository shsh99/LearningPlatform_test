package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

public class ScheduleConflictException extends BusinessException {
    public ScheduleConflictException(String message) {
        super(ErrorCode.SCHEDULE_CONFLICT, message);
    }
}
