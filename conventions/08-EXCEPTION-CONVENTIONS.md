# 08. Exception Handling Conventions

> 📌 **먼저 읽기**: [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)

**목적**: 일관된 예외 처리, 에러 응답 표준화

---

## 1. Exception 계층 구조

```
RuntimeException
└── BusinessException (공통)
    ├── NotFoundException (404)
    │   ├── UserNotFoundException
    │   └── ProductNotFoundException
    ├── DuplicateException (400)
    │   └── DuplicateEmailException
    ├── UnauthorizedException (401)
    ├── ForbiddenException (403)
    └── ValidationException (400)
```

---

## 2. 기본 예외 클래스

### BusinessException (최상위)

```java
@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
```

### 계층 구조 예외

```java
// 404
public class NotFoundException extends BusinessException { }
public class UserNotFoundException extends NotFoundException { }

// 400
public class DuplicateException extends BusinessException { }
public class ValidationException extends BusinessException { }

// 401, 403
public class UnauthorizedException extends BusinessException { }
public class ForbiddenException extends BusinessException { }
```

---

## 3. ErrorCode Enum

```java
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // ===== Common (C) =====
    INVALID_INPUT("C001", "잘못된 입력값입니다"),
    INTERNAL_SERVER_ERROR("C999", "서버 오류가 발생했습니다"),

    // ===== User (U) =====
    USER_NOT_FOUND("U001", "사용자를 찾을 수 없습니다"),
    DUPLICATE_EMAIL("U002", "이미 사용 중인 이메일입니다"),
    INVALID_PASSWORD("U003", "비밀번호가 일치하지 않습니다");

    private final String code;
    private final String message;
}
```

---

## 4. GlobalExceptionHandler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException e) {
        log.warn("NotFoundException: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse.of(e.getErrorCode()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException e) {
        log.warn("UnauthorizedException: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ErrorResponse.of(e.getErrorCode()));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException e) {
        log.warn("ForbiddenException: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ErrorResponse.of(e.getErrorCode()));
    }

    @ExceptionHandler({DuplicateException.class, BusinessException.class})
    public ResponseEntity<ErrorResponse> handleBadRequest(BusinessException e) {
        log.warn("BusinessException: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.of(e.getErrorCode()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        log.warn("ValidationException");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.of(ErrorCode.INVALID_INPUT, e.getBindingResult()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("Unexpected exception", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR));
    }
}
```

---

## 5. 에러 응답 예시

### 404 Not Found

```json
{
  "code": "U001",
  "message": "사용자를 찾을 수 없습니다",
  "timestamp": "2025-01-15T10:30:00",
  "errors": null
}
```

### 400 Bad Request (Validation)

```json
{
  "code": "C001",
  "message": "잘못된 입력값입니다",
  "timestamp": "2025-01-15T10:30:00",
  "errors": [
    {
      "field": "name",
      "rejectedValue": "",
      "message": "이름은 필수입니다"
    },
    {
      "field": "age",
      "rejectedValue": -1,
      "message": "나이는 0 이상이어야 합니다"
    }
  ]
}
```

---

## 6. 자주 하는 실수

```java
// ❌ Controller에서 try-catch
try { return ResponseEntity.ok(service.findById(id)); }
catch (Exception e) { return ResponseEntity.status(500).body(error); }

// ❌ ErrorCode 없이 예외 생성
throw new BusinessException("에러 발생");

// ❌ 예외 삼키기 (다시 던져야 함)
catch (Exception e) { log.error("에러", e); }
```

