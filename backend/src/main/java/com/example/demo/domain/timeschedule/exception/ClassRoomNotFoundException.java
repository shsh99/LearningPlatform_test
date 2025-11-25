package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

public class ClassRoomNotFoundException extends BusinessException {
    public ClassRoomNotFoundException(Long id) {
        super(ErrorCode.CLASSROOM_NOT_FOUND, "강의실을 찾을 수 없습니다: " + id);
    }
}
