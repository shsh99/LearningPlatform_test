package com.example.demo.domain.timeschedule.exception;

import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;

public class DuplicateClassRoomNameException extends BusinessException {
    public DuplicateClassRoomNameException(String name) {
        super(ErrorCode.DUPLICATE_CLASSROOM_NAME, "이미 존재하는 강의실 이름입니다: " + name);
    }
}
