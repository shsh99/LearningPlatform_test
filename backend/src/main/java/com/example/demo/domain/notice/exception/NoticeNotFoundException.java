package com.example.demo.domain.notice.exception;

import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.NotFoundException;

/**
 * 공지를 찾을 수 없을 때 발생하는 예외
 */
public class NoticeNotFoundException extends NotFoundException {

    public NoticeNotFoundException(Long noticeId) {
        super(ErrorCode.NOTICE_NOT_FOUND, "공지 ID: " + noticeId);
    }

    public NoticeNotFoundException() {
        super(ErrorCode.NOTICE_NOT_FOUND);
    }
}
