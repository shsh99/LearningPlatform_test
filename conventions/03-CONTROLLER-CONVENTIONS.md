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

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | /api/users/{id} | 200 OK |
| POST | /api/users | 201 Created |
| DELETE | /api/users/{id} | 204 No Content |

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
// ❌ 1. @Valid 누락
@PostMapping
public ResponseEntity<?> create(@RequestBody CreateUserRequest request) { }

// ❌ 2. try-catch 사용 (GlobalExceptionHandler가 처리)
@GetMapping("/{id}")
public ResponseEntity<?> getById(@PathVariable Long id) {
    try {
        return ResponseEntity.ok(service.findById(id));
    } catch (Exception e) {
        return ResponseEntity.status(404).body(error);
    }
}

// ❌ 3. Business Logic 및 Repository 직접 호출
@PostMapping
public ResponseEntity<?> create(@Valid @RequestBody CreateUserRequest req) {
    User user = new User();  // ❌ Service에서 처리
    return ResponseEntity.ok(userRepository.save(user));  // ❌ Service 호출
}
```

