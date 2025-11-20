# 07. DTO Conventions

> 📌 **먼저 읽기**: [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)

**목적**: 데이터 전송, Validation, Entity ↔ API 분리

---

## 1. Request DTO 템플릿

```java
// ✅ Record 사용 (Java 17+)
public record Create{Domain}Request(
    @NotBlank(message = "field1은 필수입니다")
    @Size(max = 100, message = "field1은 100자 이하여야 합니다")
    String field1,

    @Size(max = 500)
    String field2,

    @NotNull
    {Status}Enum status
) {
    // ✅ Compact constructor (추가 검증/가공)
    public Create{Domain}Request {
        if (field1 != null) {
            field1 = field1.trim();
        }
    }
}
```

---

## 2. Response DTO 템플릿

```java
public record {Domain}Response(
    Long id,
    String field1,
    String field2,
    {Status}Enum status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    // ✅ 정적 팩토리 메서드: Entity → DTO
    public static {Domain}Response from({Domain} entity) {
        return new {Domain}Response(
            entity.getId(),
            entity.getField1(),
            entity.getField2(),
            entity.getStatus(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }
}
```

---

## 3. DTO 네이밍

### Request DTO

```java
Create{Domain}Request      // 생성
Update{Domain}Request      // 전체 수정
Update{Field}Request       // 부분 수정
Search{Domain}Request      // 검색
```

### Response DTO

```java
{Domain}Response           // 기본 응답
{Domain}DetailResponse     // 상세 응답 (중첩 포함)
{Domain}SummaryResponse    // 요약 응답 (최소 필드)
```

---

## 4. 중첩 DTO (DetailResponse)

```java
public record {Domain}DetailResponse(
    Long id,
    String field1,
    OwnerInfo owner,                    // 중첩
    List<SubEntitySummary> subEntities  // 중첩 리스트
) {
    // ✅ 중첩 DTO는 내부 record로
    public record OwnerInfo(Long id, String name) {}
    public record SubEntitySummary(Long id, String title) {}

    // ✅ 복잡한 변환
    public static {Domain}DetailResponse from({Domain} entity, User owner, List<SubEntity> subs) {
        return new {Domain}DetailResponse(
            entity.getId(),
            entity.getField1(),
            new OwnerInfo(owner.getId(), owner.getName()),
            subs.stream().map(s -> new SubEntitySummary(s.getId(), s.getTitle())).toList()
        );
    }
}
```

---

## 5. Validation Annotations

> 전체 목록은 [Jakarta Bean Validation 공식 문서](https://jakarta.ee/specifications/bean-validation/3.0/jakarta-bean-validation-spec-3.0.html#builtinconstraints) 참고

```java
// 자주 사용하는 예시
public record Create{Domain}Request(
    @NotBlank(message = "필드는 필수입니다")
    @Size(max = 100)
    String field1,

    @NotNull @Positive
    Integer count,

    @Email
    String email
) {}
```

---

## 6. 공통 Response DTO

### PageResponse

```java
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages()
        );
    }
}
```

### ErrorResponse

```java
public record ErrorResponse(
    String code,
    String message,
    LocalDateTime timestamp
) {
    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(
            errorCode.getCode(),
            errorCode.getMessage(),
            LocalDateTime.now()
        );
    }
}
```

---

## 7. 변환 규칙

```java
// ✅ Entity → DTO: DTO의 정적 팩토리 메서드
UserResponse response = UserResponse.from(entity);

// ✅ DTO → Entity: Entity의 정적 팩토리 메서드
User entity = User.create(request.name(), request.email());

// ❌ DTO에 toEntity() 금지
public User toEntity() {  // ❌
    return User.create(this.name, this.email);
}

// ✅ List 변환
List<UserResponse> responses = entities.stream()
    .map(UserResponse::from)
    .toList();

// ✅ Page 변환
Page<UserResponse> responsePage = entityPage.map(UserResponse::from);
```

---

## 8. 폴더 구조

```
domain/{domain}/dto/
├── request/
│   ├── Create{Domain}Request.java
│   ├── Update{Domain}Request.java
│   └── Search{Domain}Request.java
└── response/
    ├── {Domain}Response.java
    ├── {Domain}DetailResponse.java
    └── {Domain}SummaryResponse.java
```

---

## 9. 자주 하는 실수

```java
// ❌ 일반 클래스 사용 (Record 필요)
public class CreateUserRequest { }

// ❌ toEntity() 메서드 (Entity 책임)
public record Request(String name) { public User toEntity() { } }

// ❌ @Valid 누락
create(@RequestBody Request req) { }

// ❌ Validation message 없음
@NotBlank String name

// ❌ Response DTO에 Validation
public record Response(@NotBlank String name) {}

// ❌ Entity 직접 반환
ResponseEntity<User> create() { }

// ❌ new 생성자 (from() 사용)
return new UserResponse(entity.getId());
```

