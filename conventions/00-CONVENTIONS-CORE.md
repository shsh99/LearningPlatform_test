# 00. Core Conventions (핵심 규칙)

**목적**: 모든 레이어에서 공통으로 적용되는 핵심 규칙

---

## Java 17-21 & Spring Boot 3.2 공통 규칙

### 1. 코딩 스타일 (Google Java Style Guide 기반)

```
✅ 들여쓰기: 4 spaces
✅ 중괄호: K&R style
✅ 한 줄 최대: 100-120자
✅ Import: static → java → third-party → own (와일드카드 금지)
```

### 2. 네이밍

```java
// 패키지: lowercase
com.company.project.domain.user

// 클래스: PascalCase
public class UserService { }
public class ProductController { }

// 메서드/변수: camelCase
public void getUserById() { }
private String userName;

// 상수: UPPER_SNAKE_CASE
private static final int MAX_COUNT = 100;

// Enum: PascalCase + STRING 타입
@Enumerated(EnumType.STRING)
private UserStatus status;
```

### 3. 필수 Annotations

```java
// Controller
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated

// Service
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j

// Entity
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter  // ⛔ Setter 금지!

// Repository
public interface UserRepository extends JpaRepository<User, Long> { }

// DTO (Request)
public record CreateUserRequest(
    @NotBlank String name,
    @Email String email
) { }

// DTO (Response)
public record UserResponse(Long id, String name) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName());
    }
}
```

### 4. 레이어 책임

```
Controller
  ✅ HTTP 요청/응답 처리
  ✅ Validation (@Valid, @Validated)
  ✅ Service 호출
  ❌ Business Logic 금지
  ❌ Repository 직접 호출 금지

Service
  ✅ Business Logic
  ✅ Transaction 관리
  ✅ Entity ↔ DTO 변환 조율
  ❌ HTTP 관련 처리 금지

Repository
  ✅ 데이터 접근
  ✅ 쿼리 정의
  ❌ Business Logic 금지

Entity
  ✅ 도메인 로직 (비즈니스 메서드)
  ✅ 상태 관리
  ⛔ Setter 금지 (비즈니스 메서드로 대체)

DTO
  ✅ 데이터 전송
  ✅ Validation
  ✅ Entity → DTO: 정적 팩토리 메서드 (from)
  ❌ toEntity() 금지
```

### 5. 예외 처리

```java
// Service에서 예외 발생
throw new UserNotFoundException(id);
throw new DuplicateEmailException(email);

// GlobalExceptionHandler가 자동 처리
// Controller에서 try-catch 금지!
```

### 6. Transaction 관리

```java
@Service
@Transactional(readOnly = true)  // 클래스 레벨: 기본 읽기 전용
public class UserService {

    // 읽기: readOnly = true (클래스 레벨 적용)
    public User findById(Long id) { }

    // 쓰기: @Transactional (readOnly = false)
    @Transactional
    public User create(CreateUserRequest request) { }
}
```

### 7. Entity ↔ DTO 변환

```java
// ✅ Entity → DTO: DTO의 정적 팩토리 메서드
UserResponse response = UserResponse.from(entity);

// ✅ DTO → Entity: Entity의 정적 팩토리 메서드
User entity = User.create(request.name(), request.email());

// ❌ DTO에 toEntity() 금지
```

### 8. RESTful API 규칙

```java
GET    /api/users          // 목록 조회
GET    /api/users/{id}     // 단건 조회
POST   /api/users          // 생성 (201 Created)
PUT    /api/users/{id}     // 전체 수정 (200 OK)
PATCH  /api/users/{id}     // 부분 수정 (200 OK)
DELETE /api/users/{id}     // 삭제 (204 No Content)
```

### 9. Enum 사용 규칙

```java
// ✅ 항상 STRING 타입
@Enumerated(EnumType.STRING)
private UserStatus status;

// ❌ ORDINAL 절대 금지
```

### 10. Lombok 사용 규칙

```
✅ 허용: @RequiredArgsConstructor, @Getter, @NoArgsConstructor, @Builder, @Slf4j
⚠️ 주의: @AllArgsConstructor (Entity에서 금지)
⛔ 금지: @Setter, @Data (Entity에 절대 사용 금지)
```

---

## 레이어별 상세 컨벤션

각 레이어 작성 시 함께 참고:

- Controller: [03-CONTROLLER-CONVENTIONS.md](./03-CONTROLLER-CONVENTIONS.md)
- Service: [04-SERVICE-CONVENTIONS.md](./04-SERVICE-CONVENTIONS.md)
- Repository: [05-REPOSITORY-CONVENTIONS.md](./05-REPOSITORY-CONVENTIONS.md)
- Entity: [06-ENTITY-CONVENTIONS.md](./06-ENTITY-CONVENTIONS.md)
- DTO: [07-DTO-CONVENTIONS.md](./07-DTO-CONVENTIONS.md)
- Exception: [08-EXCEPTION-CONVENTIONS.md](./08-EXCEPTION-CONVENTIONS.md)

프로젝트 구조: [01-PROJECT-STRUCTURE.md](./01-PROJECT-STRUCTURE.md)

---

## 체크리스트

모든 코드 작성 후 확인:

- [ ] Google Java Style Guide 준수
- [ ] 적절한 네이밍 (PascalCase, camelCase)
- [ ] 필수 Annotation 사용
- [ ] 레이어 책임 준수
- [ ] Setter 사용 안 함 (Entity)
- [ ] Enum은 STRING 타입
- [ ] Transaction 적절히 관리
- [ ] 예외는 GlobalExceptionHandler가 처리
- [ ] Entity ↔ DTO 변환 규칙 준수
- [ ] RESTful API 규칙 준수
