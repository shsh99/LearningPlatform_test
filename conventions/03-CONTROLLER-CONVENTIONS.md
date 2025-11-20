# 03. Controller Conventions

> 📌 **먼저 읽기**: [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)

**목적**: HTTP 요청/응답 처리, Validation, Service 호출

---

## 1. 기본 템플릿

```java
@RestController
@RequestMapping("/api/{resources}")  // 복수형, 케밥-케이스
@RequiredArgsConstructor
@Validated
public class {Domain}Controller {

    private final {Domain}Service {domain}Service;

    // ✅ 목록 조회 (페이징)
    @GetMapping
    public ResponseEntity<PageResponse<{Domain}Response>> getAll(
        @PageableDefault(size = 20, sort = "createdAt", direction = DESC)
        Pageable pageable) {
        return ResponseEntity.ok({domain}Service.findAll(pageable));
    }

    // ✅ 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<{Domain}Response> getById(
        @PathVariable @Positive Long id) {
        return ResponseEntity.ok({domain}Service.findById(id));
    }

    // ✅ 생성 (201 Created)
    @PostMapping
    public ResponseEntity<{Domain}Response> create(
        @Valid @RequestBody Create{Domain}Request request) {
        {Domain}Response response = {domain}Service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ✅ 전체 수정
    @PutMapping("/{id}")
    public ResponseEntity<{Domain}Response> update(
        @PathVariable @Positive Long id,
        @Valid @RequestBody Update{Domain}Request request) {
        return ResponseEntity.ok({domain}Service.update(id, request));
    }

    // ✅ 부분 수정
    @PatchMapping("/{id}/status")
    public ResponseEntity<{Domain}Response> updateStatus(
        @PathVariable @Positive Long id,
        @Valid @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok({domain}Service.updateStatus(id, request));
    }

    // ✅ 삭제 (204 No Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @Positive Long id) {
        {domain}Service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 2. URL 규칙

```
✅ GOOD
/api/products                    // 복수형
/api/order-items                 // 케밥-케이스
/api/users/{id}/orders           // 하위 리소스
/api/products/{id}/activate      // 액션 (동사 허용)

❌ BAD
/api/product                     // 단수형
/api/orderItems                  // camelCase
/api/getProducts                 // 동사
/api/Product                     // 대문자
```

---

## 3. HTTP 상태 코드

```java
GET     /api/users          → 200 OK
GET     /api/users/{id}     → 200 OK
POST    /api/users          → 201 Created
PUT     /api/users/{id}     → 200 OK
PATCH   /api/users/{id}     → 200 OK
DELETE  /api/users/{id}     → 204 No Content
```

---

## 4. Validation

```java
@RestController
@Validated  // ✅ Path Variable/Query Param validation용
public class {Domain}Controller {

    // ✅ Request Body: @Valid
    @PostMapping
    public ResponseEntity<?> create(
        @Valid @RequestBody Create{Domain}Request request) { }

    // ✅ Path Variable: @Positive, @NotBlank 등
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
        @PathVariable @Positive Long id) { }

    // ✅ Query Param: @Min, @Max 등
    @GetMapping
    public ResponseEntity<?> search(
        @RequestParam @NotBlank String keyword,
        @RequestParam @Min(1) @Max(100) int limit) { }
}
```

---

## 5. 책임 범위

### ✅ Controller가 해야 할 일

```
1. Validation (Annotation)
2. Service 호출
3. HTTP 응답 생성 (ResponseEntity)
```

### ❌ Controller가 하면 안 되는 일

```
1. Business Logic
2. Entity 직접 생성/수정
3. Repository 직접 호출
4. try-catch 예외 처리 (GlobalExceptionHandler가 처리)
5. DTO 변환
```

---

## 6. 자주 하는 실수

```java
// ❌ 1. @RestController 대신 @Controller
@Controller  // ❌
public class UserController { }

// ❌ 2. @Valid 누락
@PostMapping
public ResponseEntity<?> create(
    @RequestBody CreateUserRequest request) { }  // ❌

// ❌ 3. ResponseEntity 없음
@GetMapping("/{id}")
public UserResponse getById(@PathVariable Long id) { }  // ❌

// ❌ 4. try-catch
@GetMapping("/{id}")
public ResponseEntity<?> getById(@PathVariable Long id) {
    try {  // ❌ GlobalExceptionHandler가 처리
        return ResponseEntity.ok(service.findById(id));
    } catch (Exception e) {
        return ResponseEntity.status(404).body(error);
    }
}

// ❌ 5. Business Logic
@PostMapping
public ResponseEntity<?> create(@Valid @RequestBody CreateUserRequest req) {
    if (req.age() < 18) {  // ❌ Service에서
        throw new ValidationException("18세 이상만 가능");
    }
    User user = new User();  // ❌ Service에서
    user.setName(req.name());  // ❌ Service에서
    return ResponseEntity.ok(userRepository.save(user));  // ❌ Repository 직접 호출
}
```

---

## 체크리스트

- [ ] `@RestController`, `@RequestMapping`, `@Validated`
- [ ] URL: 소문자, 케밥-케이스, 복수형
- [ ] RESTful 매핑 (GET, POST, PUT, PATCH, DELETE)
- [ ] `@Valid` (Request Body), `@Positive` 등 (Path Variable)
- [ ] `ResponseEntity` 반환
- [ ] 적절한 HTTP 상태 코드 (201, 200, 204)
- [ ] Business logic 없음
- [ ] Repository 직접 호출 없음
- [ ] try-catch 없음
