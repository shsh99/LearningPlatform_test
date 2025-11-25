package com.example.demo.global.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // User
    USER_NOT_FOUND("U001", "사용자를 찾을 수 없습니다."),
    USER_ALREADY_EXISTS("U002", "이미 존재하는 사용자입니다."),
    USER_NOT_ACTIVE("U003", "활성화되지 않은 사용자입니다."),
    INVALID_CURRENT_PASSWORD("U004", "현재 비밀번호가 일치하지 않습니다."),
    PASSWORDS_DO_NOT_MATCH("U005", "새 비밀번호가 일치하지 않습니다."),
    ACCOUNT_DELETED("U006", "탈퇴한 계정입니다."),

    // Auth
    INVALID_CREDENTIALS("A001", "이메일 또는 비밀번호가 올바르지 않습니다."),
    UNAUTHORIZED("A002", "인증이 필요합니다."),
    FORBIDDEN("A003", "권한이 없습니다."),
    INVALID_TOKEN("A004", "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN("A005", "만료된 토큰입니다."),
    REFRESH_TOKEN_NOT_FOUND("A006", "Refresh Token을 찾을 수 없습니다."),
    REFRESH_TOKEN_EXPIRED("A007", "Refresh Token이 만료되었습니다."),
    INVALID_RESET_TOKEN("A008", "유효하지 않은 재설정 토큰입니다."),
    RESET_TOKEN_EXPIRED("A009", "재설정 토큰이 만료되었습니다."),
    RESET_TOKEN_ALREADY_USED("A010", "이미 사용된 재설정 토큰입니다."),
    SAME_AS_OLD_PASSWORD("A011", "새 비밀번호는 기존 비밀번호와 달라야 합니다."),

    // Course
    COURSE_NOT_FOUND("CO001", "강의를 찾을 수 없습니다."),

    // CourseApplication
    COURSE_APPLICATION_NOT_FOUND("CA001", "강의 개설 신청을 찾을 수 없습니다."),

    // Enrollment
    ALREADY_ENROLLED("E001", "이미 수강 신청한 강의입니다."),
    ENROLLMENT_NOT_FOUND("E002", "수강 신청을 찾을 수 없습니다."),

    // Term
    TERM_NOT_FOUND("T001", "학기를 찾을 수 없습니다."),

    // Common
    INVALID_INPUT("C001", "잘못된 입력입니다."),
    INTERNAL_SERVER_ERROR("C002", "서버 내부 오류가 발생했습니다.");

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
