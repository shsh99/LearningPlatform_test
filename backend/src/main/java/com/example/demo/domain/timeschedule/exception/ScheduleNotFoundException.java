package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

public class ScheduleNotFoundException extends BusinessException {
    public ScheduleNotFoundException(Long id) {
        super(ErrorCode.SCHEDULE_NOT_FOUND, "일정을 찾을 수 없습니다: " + id);
    }
}
