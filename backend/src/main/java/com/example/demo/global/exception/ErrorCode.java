package com.example.demo.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // ==================== User (U0xx) ====================
    USER_NOT_FOUND("U001", "사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("U002", "이미 존재하는 사용자입니다.", HttpStatus.CONFLICT),
    USER_NOT_ACTIVE("U003", "활성화되지 않은 사용자입니다.", HttpStatus.FORBIDDEN),
    INVALID_CURRENT_PASSWORD("U004", "현재 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    PASSWORDS_DO_NOT_MATCH("U005", "새 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    ACCOUNT_DELETED("U006", "탈퇴한 계정입니다.", HttpStatus.FORBIDDEN),
    ACCOUNT_SUSPENDED("U007", "정지된 계정입니다.", HttpStatus.FORBIDDEN),
    ACCOUNT_LOCKED("U008", "계정이 잠겼습니다. 잠시 후 다시 시도해주세요.", HttpStatus.LOCKED),
    INVALID_PASSWORD_FORMAT("U009", "비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL_FORMAT("U010", "유효하지 않은 이메일 형식입니다.", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS("U011", "이미 사용 중인 이메일입니다.", HttpStatus.CONFLICT),
    CANNOT_DELETE_SELF("U012", "자기 자신은 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST),
    CANNOT_CHANGE_OWN_ROLE("U013", "자신의 역할은 변경할 수 없습니다.", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_ROLE("U014", "해당 역할을 부여할 권한이 없습니다.", HttpStatus.FORBIDDEN),

    // ==================== Auth (A0xx) ====================
    INVALID_CREDENTIALS("A001", "이메일 또는 비밀번호가 올바르지 않습니다.", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("A002", "인증이 필요합니다.", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("A003", "권한이 없습니다.", HttpStatus.FORBIDDEN),
    INVALID_TOKEN("A004", "유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED),
    EXPIRED_TOKEN("A005", "만료된 토큰입니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND("A006", "Refresh Token을 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_EXPIRED("A007", "Refresh Token이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    INVALID_RESET_TOKEN("A008", "유효하지 않은 재설정 토큰입니다.", HttpStatus.BAD_REQUEST),
    RESET_TOKEN_EXPIRED("A009", "재설정 토큰이 만료되었습니다.", HttpStatus.BAD_REQUEST),
    RESET_TOKEN_ALREADY_USED("A010", "이미 사용된 재설정 토큰입니다.", HttpStatus.BAD_REQUEST),
    SAME_AS_OLD_PASSWORD("A011", "새 비밀번호는 기존 비밀번호와 달라야 합니다.", HttpStatus.BAD_REQUEST),
    MAX_LOGIN_ATTEMPTS_EXCEEDED("A012", "로그인 시도 횟수를 초과했습니다.", HttpStatus.TOO_MANY_REQUESTS),
    SESSION_EXPIRED("A013", "세션이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    CONCURRENT_SESSION_LIMIT("A014", "동시 접속 가능한 세션 수를 초과했습니다.", HttpStatus.CONFLICT),

    // ==================== Course (CO0xx) ====================
    COURSE_NOT_FOUND("CO001", "강의를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    COURSE_ALREADY_EXISTS("CO002", "동일한 제목의 강의가 이미 존재합니다.", HttpStatus.CONFLICT),
    COURSE_NOT_APPROVED("CO003", "승인되지 않은 강의입니다.", HttpStatus.FORBIDDEN),
    COURSE_ALREADY_APPROVED("CO004", "이미 승인된 강의입니다.", HttpStatus.CONFLICT),
    COURSE_ALREADY_REJECTED("CO005", "이미 거부된 강의입니다.", HttpStatus.CONFLICT),
    INVALID_COURSE_STATUS_TRANSITION("CO006", "유효하지 않은 강의 상태 변경입니다.", HttpStatus.BAD_REQUEST),
    COURSE_HAS_ACTIVE_TERMS("CO007", "진행 중인 차수가 있어 강의를 삭제할 수 없습니다.", HttpStatus.CONFLICT),
    COURSE_HAS_ENROLLMENTS("CO008", "수강생이 있어 강의를 삭제할 수 없습니다.", HttpStatus.CONFLICT),
    COURSE_NOT_EDITABLE("CO009", "승인된 강의는 수정할 수 없습니다.", HttpStatus.FORBIDDEN),

    // ==================== CourseApplication (CA0xx) ====================
    COURSE_APPLICATION_NOT_FOUND("CA001", "강의 개설 신청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    COURSE_APPLICATION_ALREADY_PROCESSED("CA002", "이미 처리된 신청입니다.", HttpStatus.CONFLICT),
    COURSE_APPLICATION_CANCELLED("CA003", "취소된 신청입니다.", HttpStatus.BAD_REQUEST),
    DUPLICATE_COURSE_APPLICATION("CA004", "동일한 강의 신청이 이미 존재합니다.", HttpStatus.CONFLICT),

    // ==================== Enrollment (E0xx) ====================
    ALREADY_ENROLLED("E001", "이미 수강 신청한 강의입니다.", HttpStatus.CONFLICT),
    ENROLLMENT_NOT_FOUND("E002", "수강 신청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    ENROLLMENT_ALREADY_CANCELLED("E003", "이미 취소된 수강입니다.", HttpStatus.CONFLICT),
    ENROLLMENT_ALREADY_COMPLETED("E004", "이미 완료된 수강입니다.", HttpStatus.CONFLICT),
    ENROLLMENT_PERIOD_NOT_OPEN("E005", "수강 신청 기간이 아닙니다.", HttpStatus.BAD_REQUEST),
    ENROLLMENT_PERIOD_CLOSED("E006", "수강 신청 기간이 종료되었습니다.", HttpStatus.BAD_REQUEST),
    CANNOT_CANCEL_STARTED_COURSE("E007", "이미 시작된 강의는 취소할 수 없습니다.", HttpStatus.BAD_REQUEST),
    PREREQUISITE_NOT_MET("E008", "선수 과목을 이수하지 않았습니다.", HttpStatus.BAD_REQUEST),
    ENROLLMENT_LIMIT_EXCEEDED("E009", "동시 수강 가능한 강의 수를 초과했습니다.", HttpStatus.BAD_REQUEST),

    // ==================== Term (T0xx) ====================
    TERM_NOT_FOUND("T001", "차수를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    TERM_CAPACITY_EXCEEDED("T002", "수강 정원이 초과되었습니다.", HttpStatus.CONFLICT),
    TERM_ALREADY_STARTED("T003", "이미 시작된 차수입니다.", HttpStatus.BAD_REQUEST),
    TERM_ALREADY_COMPLETED("T004", "이미 종료된 차수입니다.", HttpStatus.BAD_REQUEST),
    TERM_ALREADY_CANCELLED("T005", "취소된 차수입니다.", HttpStatus.BAD_REQUEST),
    TERM_NOT_OPEN("T006", "아직 모집이 시작되지 않은 차수입니다.", HttpStatus.BAD_REQUEST),
    INVALID_TERM_DATE_RANGE("T007", "시작일이 종료일보다 늦을 수 없습니다.", HttpStatus.BAD_REQUEST),
    TERM_DATE_OVERLAP("T008", "다른 차수와 기간이 중복됩니다.", HttpStatus.CONFLICT),
    TERM_HAS_ENROLLMENTS("T009", "수강생이 있어 차수를 삭제할 수 없습니다.", HttpStatus.CONFLICT),
    INVALID_TERM_STATUS_TRANSITION("T010", "유효하지 않은 차수 상태 변경입니다.", HttpStatus.BAD_REQUEST),
    TERM_CAPACITY_LESS_THAN_ENROLLED("T011", "정원은 현재 등록된 인원보다 작을 수 없습니다.", HttpStatus.BAD_REQUEST),

    // ==================== Tenant (TN0xx) ====================
    TENANT_NOT_FOUND("TN001", "테넌트를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    TENANT_CODE_ALREADY_EXISTS("TN002", "이미 사용 중인 테넌트 코드입니다.", HttpStatus.CONFLICT),
    TENANT_NOT_ACTIVE("TN003", "비활성화된 테넌트입니다.", HttpStatus.FORBIDDEN),
    UNAUTHORIZED_TENANT_ACCESS("TN004", "다른 테넌트의 리소스에 접근할 수 없습니다.", HttpStatus.FORBIDDEN),
    TENANT_SUSPENDED("TN005", "정지된 테넌트입니다. 관리자에게 문의하세요.", HttpStatus.FORBIDDEN),
    TENANT_SUBDOMAIN_ALREADY_EXISTS("TN006", "이미 사용 중인 서브도메인입니다.", HttpStatus.CONFLICT),
    TENANT_USER_LIMIT_EXCEEDED("TN007", "테넌트의 최대 사용자 수를 초과했습니다.", HttpStatus.PAYMENT_REQUIRED),
    TENANT_COURSE_LIMIT_EXCEEDED("TN008", "테넌트의 최대 강의 수를 초과했습니다.", HttpStatus.PAYMENT_REQUIRED),
    TENANT_STORAGE_LIMIT_EXCEEDED("TN009", "테넌트의 스토리지 용량을 초과했습니다.", HttpStatus.PAYMENT_REQUIRED),
    TENANT_PLAN_FEATURE_NOT_AVAILABLE("TN010", "현재 요금제에서 사용할 수 없는 기능입니다.", HttpStatus.PAYMENT_REQUIRED),
    TENANT_BRANDING_NOT_FOUND("TN011", "테넌트 브랜딩 설정을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),

    // ==================== TenantApplication (TA0xx) ====================
    APPLICATION_NOT_FOUND("TA001", "테넌트 신청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    APPLICATION_ALREADY_PROCESSED("TA002", "이미 처리된 신청입니다.", HttpStatus.CONFLICT),
    APPLICATION_ALREADY_CANCELLED("TA003", "취소된 신청입니다.", HttpStatus.BAD_REQUEST),
    DUPLICATE_APPLICATION("TA004", "동일한 이메일로 신청이 이미 존재합니다.", HttpStatus.CONFLICT),

    // ==================== Instructor (I0xx) ====================
    INSTRUCTOR_NOT_FOUND("I001", "강사를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    INSTRUCTOR_ALREADY_ASSIGNED("I002", "이미 배정된 강사입니다.", HttpStatus.CONFLICT),
    INSTRUCTOR_NOT_ASSIGNED("I003", "배정되지 않은 강사입니다.", HttpStatus.BAD_REQUEST),
    INSTRUCTOR_HAS_ACTIVE_COURSES("I004", "진행 중인 강의가 있어 강사를 해제할 수 없습니다.", HttpStatus.CONFLICT),

    // ==================== TermRequest (TR0xx) ====================
    TERM_REQUEST_NOT_FOUND("TR001", "차수 요청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    TERM_REQUEST_ALREADY_PROCESSED("TR002", "이미 처리된 요청입니다.", HttpStatus.CONFLICT),
    TERM_REQUEST_NOT_PENDING("TR003", "대기 중인 요청만 처리할 수 있습니다.", HttpStatus.BAD_REQUEST),
    TERM_REQUEST_DUPLICATE_PENDING("TR004", "해당 차수에 대기 중인 요청이 이미 존재합니다.", HttpStatus.CONFLICT),
    TERM_REQUEST_HAS_ENROLLMENTS("TR005", "수강생이 있어 삭제 요청을 할 수 없습니다.", HttpStatus.BAD_REQUEST),
    TERM_REQUEST_NOT_OWNER("TR006", "본인의 요청만 취소할 수 있습니다.", HttpStatus.FORBIDDEN),
    TERM_REQUEST_NOT_INSTRUCTOR("TR007", "해당 차수의 담당 강사만 요청할 수 있습니다.", HttpStatus.FORBIDDEN),

    // ==================== File (F0xx) ====================
    FILE_NOT_FOUND("F001", "파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    FILE_UPLOAD_FAILED("F002", "파일 업로드에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_SIZE_EXCEEDED("F003", "파일 크기가 제한을 초과했습니다.", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE("F004", "지원하지 않는 파일 형식입니다.", HttpStatus.BAD_REQUEST),
    FILE_DELETE_FAILED("F005", "파일 삭제에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

    // ==================== Common (C0xx) ====================
    INVALID_INPUT("C001", "잘못된 입력입니다.", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR("C002", "서버 내부 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    DUPLICATE_RESOURCE("C003", "이미 존재하는 리소스입니다.", HttpStatus.CONFLICT),
    RESOURCE_NOT_FOUND("C004", "요청한 리소스를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    INVALID_REQUEST("C005", "잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    DATA_INTEGRITY_VIOLATION("C006", "데이터 무결성 오류가 발생했습니다.", HttpStatus.CONFLICT),
    OPTIMISTIC_LOCK_FAILURE("C007", "다른 사용자가 동시에 수정했습니다. 다시 시도해주세요.", HttpStatus.CONFLICT),
    SERVICE_UNAVAILABLE("C008", "서비스를 일시적으로 사용할 수 없습니다.", HttpStatus.SERVICE_UNAVAILABLE);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
