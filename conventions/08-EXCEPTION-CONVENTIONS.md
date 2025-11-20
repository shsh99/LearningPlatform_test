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

### NotFoundException (404)

```java
public class NotFoundException extends BusinessException {

    public NotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }

    public NotFoundException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
```

### 도메인 특화 예외

```java
// ✅ 도메인별 NotFoundException
public class UserNotFoundException extends NotFoundException {

    public UserNotFoundException(Long id) {
        super(ErrorCode.USER_NOT_FOUND);
    }

    public UserNotFoundException(String message) {
        super(message, ErrorCode.USER_NOT_FOUND);
    }
}

// ✅ 중복 예외
public class DuplicateEmailException extends DuplicateException {

    public DuplicateEmailException(String email) {
        super("이미 사용 중인 이메일입니다: " + email, ErrorCode.DUPLICATE_EMAIL);
    }
}

// ✅ 권한 예외
public class UserAccessDeniedException extends ForbiddenException {

    public UserAccessDeniedException(String message) {
        super(message);
    }
}
```

---

## 3. ErrorCode Enum

```java
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // ===== Common (C) =====
    INVALID_INPUT("C001", "잘못된 입력값입니다"),
    UNAUTHORIZED("C002", "인증이 필요합니다"),
    FORBIDDEN("C003", "권한이 없습니다"),
    INTERNAL_SERVER_ERROR("C999", "서버 오류가 발생했습니다"),

    // ===== User (U) =====
    USER_NOT_FOUND("U001", "사용자를 찾을 수 없습니다"),
    DUPLICATE_EMAIL("U002", "이미 사용 중인 이메일입니다"),
    INVALID_PASSWORD("U003", "비밀번호가 일치하지 않습니다"),

    // ===== Product (P) =====
    PRODUCT_NOT_FOUND("P001", "상품을 찾을 수 없습니다"),
    OUT_OF_STOCK("P002", "재고가 부족합니다"),

    // ===== Auth (A) =====
    INVALID_TOKEN("A001", "유효하지 않은 토큰입니다"),
    EXPIRED_TOKEN("A002", "만료된 토큰입니다");

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

## 5. 예외 사용 패턴

### Service에서 예외 발생

```java
@Service
@Transactional(readOnly = true)
public class UserService {

    // ✅ GOOD: 명확한 예외
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));

        return UserResponse.from(user);
    }

    // ✅ GOOD: 비즈니스 규칙 위반
    @Transactional
    public void activate(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));

        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new InvalidUserStatusException("이미 활성화된 상태입니다");
        }

        user.activate();
    }

    // ✅ GOOD: 중복 검사
    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException(request.email());
        }

        User user = User.create(request.name(), request.email());
        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }
}
```

### Controller에서는 예외 처리 안 함

```java
// ✅ GOOD: 예외는 던지기만
@RestController
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
        // Service에서 예외 발생 → GlobalExceptionHandler 처리
    }
}

// ❌ BAD: Controller에서 try-catch
@GetMapping("/{id}")
public ResponseEntity<?> getById(@PathVariable Long id) {
    try {  // ❌
        return ResponseEntity.ok(userService.findById(id));
    } catch (UserNotFoundException e) {
        return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
    }
}
```

---

## 6. 에러 응답 예시

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

## 7. 자주 하는 실수

```java
// ❌ Controller에서 try-catch
try { return ResponseEntity.ok(service.findById(id)); }
catch (Exception e) { return ResponseEntity.status(500).body(error); }

// ❌ Exception 직접 상속 (RuntimeException 상속 필요)
public class UserException extends Exception { }

// ❌ ErrorCode 없이 예외 생성
throw new BusinessException("에러 발생");

// ❌ 일반적인 예외명 (구체적인 예외 사용)
throw new RuntimeException("에러");

// ❌ 예외 삼키기 (다시 던져야 함)
catch (Exception e) { log.error("에러", e); }
```

---

## 체크리스트

- [ ] BusinessException 계층 구조
- [ ] ErrorCode Enum 정의
- [ ] 도메인별 예외 클래스
- [ ] GlobalExceptionHandler 구현
- [ ] ErrorResponse DTO
- [ ] Service에서 예외 발생
- [ ] Controller에서 예외 처리 안 함
- [ ] 적절한 HTTP 상태 코드
- [ ] 명확한 에러 메시지
- [ ] Validation 에러 필드 정보
