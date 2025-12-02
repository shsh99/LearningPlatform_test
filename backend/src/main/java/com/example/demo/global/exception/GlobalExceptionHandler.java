package com.example.demo.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * BusinessException 및 하위 예외 통합 처리
     * ErrorCode에 정의된 HttpStatus 사용
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        ErrorCode errorCode = e.getErrorCode();
        log.warn("BusinessException [{}]: {}", errorCode.getCode(), e.getMessage());
        return ResponseEntity
            .status(errorCode.getHttpStatus())
            .body(ErrorResponse.of(errorCode, e.getMessage()));
    }

    /**
     * Spring Security 접근 거부
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e) {
        log.warn("AccessDeniedException: {}", e.getMessage());
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ErrorResponse.of(ErrorCode.FORBIDDEN));
    }

    /**
     * @Valid 유효성 검증 실패
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        String message = errors.entrySet().stream()
            .map(entry -> entry.getKey() + ": " + entry.getValue())
            .reduce((a, b) -> a + ", " + b)
            .orElse("유효성 검증 실패");

        log.warn("Validation error: {}", message);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.ofValidation(ErrorCode.INVALID_INPUT, message, errors));
    }

    /**
     * 요청 파라미터 누락
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParameter(MissingServletRequestParameterException e) {
        String message = String.format("필수 파라미터 '%s'가 누락되었습니다.", e.getParameterName());
        log.warn("MissingParameter: {}", message);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.of(ErrorCode.INVALID_INPUT, message));
    }

    /**
     * 파라미터 타입 불일치
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        String message = String.format("파라미터 '%s'의 타입이 올바르지 않습니다.", e.getName());
        log.warn("TypeMismatch: {}", message);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.of(ErrorCode.INVALID_INPUT, message));
    }

    /**
     * 파일 크기 초과
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSize(MaxUploadSizeExceededException e) {
        log.warn("MaxUploadSizeExceeded: {}", e.getMessage());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.of(ErrorCode.FILE_SIZE_EXCEEDED));
    }

    /**
     * 데이터 무결성 위반 (DB 제약조건)
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        log.error("DataIntegrityViolation: {}", e.getMessage());
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ErrorResponse.of(ErrorCode.DATA_INTEGRITY_VIOLATION));
    }

    /**
     * 낙관적 락 실패 (동시 수정)
     */
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ErrorResponse> handleOptimisticLock(OptimisticLockingFailureException e) {
        log.warn("OptimisticLockFailure: {}", e.getMessage());
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ErrorResponse.of(ErrorCode.OPTIMISTIC_LOCK_FAILURE));
    }

    /**
     * IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("IllegalArgumentException: {}", e.getMessage());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.of(ErrorCode.INVALID_INPUT, e.getMessage()));
    }

    /**
     * IllegalStateException
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException e) {
        log.warn("IllegalStateException: {}", e.getMessage());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.of(ErrorCode.INVALID_REQUEST, e.getMessage()));
    }

    /**
     * 기타 RuntimeException
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        log.error("RuntimeException: {}", e.getMessage(), e);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR));
    }

    /**
     * 기타 모든 예외
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("Unexpected error occurred: {}", e.getMessage(), e);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR));
    }
}
