# Coding Conventions Guide

> Spring Boot 3.2 + Java 17-21 프로젝트 코딩 컨벤션

---

## 📁 컨벤션 문서 위치

모든 코딩 컨벤션은 [`conventions/`](./conventions/) 폴더에 있습니다.

---

## 🚀 빠른 시작

### 1. 먼저 읽기 (필수)

**[conventions/00-CONVENTIONS-CORE.md](./conventions/00-CONVENTIONS-CORE.md)** ⭐

- 모든 레이어에서 공통으로 적용되는 핵심 규칙
- 코드 작성 전 반드시 읽을 것

### 2. 레이어별 가이드

코드 작성 시 해당 레이어 가이드 참고:

| 레이어 | 가이드 문서 | 주요 내용 |
|--------|------------|-----------|
| **Controller** | [03-CONTROLLER-CONVENTIONS.md](./conventions/03-CONTROLLER-CONVENTIONS.md) | HTTP 요청/응답, RESTful API |
| **Service** | [04-SERVICE-CONVENTIONS.md](./conventions/04-SERVICE-CONVENTIONS.md) | Business Logic, Transaction |
| **Repository** | [05-REPOSITORY-CONVENTIONS.md](./conventions/05-REPOSITORY-CONVENTIONS.md) | 데이터 접근, Query |
| **Entity** | [06-ENTITY-CONVENTIONS.md](./conventions/06-ENTITY-CONVENTIONS.md) | 도메인 모델, Setter 금지 |
| **DTO** | [07-DTO-CONVENTIONS.md](./conventions/07-DTO-CONVENTIONS.md) | Request/Response, Validation |
| **Exception** | [08-EXCEPTION-CONVENTIONS.md](./conventions/08-EXCEPTION-CONVENTIONS.md) | 예외 처리 |

### 3. 프로젝트 구조

**[conventions/01-PROJECT-STRUCTURE.md](./conventions/01-PROJECT-STRUCTURE.md)**

- Domain-Driven 구조
- 패키지 구성 및 의존성 규칙

---

## 🎯 핵심 원칙 5가지

### 1️⃣ Setter 금지 (Entity)
```java
// ❌ 금지
public void setName(String name) { }

// ✅ 비즈니스 메서드
public void updateName(String newName) {
    validateName(newName);
    this.name = newName;
}
```

### 2️⃣ Enum은 STRING 타입
```java
// ✅ 항상 STRING
@Enumerated(EnumType.STRING)
private UserStatus status;

// ❌ ORDINAL 절대 금지
@Enumerated(EnumType.ORDINAL)  // ❌
```

### 3️⃣ Transaction 관리
```java
@Service
@Transactional(readOnly = true)  // ✅ 클래스 레벨: 읽기 전용
public class UserService {

    // 읽기: readOnly = true (클래스 레벨 적용)
    public User findById(Long id) { }

    // 쓰기: @Transactional (readOnly = false)
    @Transactional
    public User create(CreateUserRequest request) { }
}
```

### 4️⃣ Entity ↔ DTO 변환
```java
// ✅ Entity → DTO: DTO의 정적 팩토리 메서드
UserResponse response = UserResponse.from(entity);

// ✅ DTO → Entity: Entity의 정적 팩토리 메서드
User entity = User.create(request.name(), request.email());

// ❌ DTO에 toEntity() 금지
```

### 5️⃣ 예외는 GlobalExceptionHandler가 처리
```java
// ✅ Service에서 던지기만
throw new UserNotFoundException(id);

// ❌ Controller에서 try-catch 금지
@GetMapping("/{id}")
public ResponseEntity<?> getById(@PathVariable Long id) {
    try {  // ❌
        return ResponseEntity.ok(service.findById(id));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(error);
    }
}
```

---

## 📖 전체 문서 목록

### 필수 문서
- [conventions/README.md](./conventions/README.md) - 전체 개요
- [conventions/00-CONVENTIONS-CORE.md](./conventions/00-CONVENTIONS-CORE.md) - 핵심 규칙

### 구조 가이드
- [conventions/01-PROJECT-STRUCTURE.md](./conventions/01-PROJECT-STRUCTURE.md) - 프로젝트 구조
- [conventions/02-GIT-CONVENTIONS.md](./conventions/02-GIT-CONVENTIONS.md) - Git 컨벤션
- [conventions/09-GIT-SUBMODULE-CONVENTIONS.md](./conventions/09-GIT-SUBMODULE-CONVENTIONS.md) - Submodule (민감 정보 관리)

### 레이어별 가이드
- [conventions/03-CONTROLLER-CONVENTIONS.md](./conventions/03-CONTROLLER-CONVENTIONS.md)
- [conventions/04-SERVICE-CONVENTIONS.md](./conventions/04-SERVICE-CONVENTIONS.md)
- [conventions/05-REPOSITORY-CONVENTIONS.md](./conventions/05-REPOSITORY-CONVENTIONS.md)
- [conventions/06-ENTITY-CONVENTIONS.md](./conventions/06-ENTITY-CONVENTIONS.md)
- [conventions/07-DTO-CONVENTIONS.md](./conventions/07-DTO-CONVENTIONS.md)
- [conventions/08-EXCEPTION-CONVENTIONS.md](./conventions/08-EXCEPTION-CONVENTIONS.md)

---

## 💡 사용 예시

### Controller 작성 시
```markdown
1. conventions/00-CONVENTIONS-CORE.md 읽기 (필수)
2. conventions/03-CONTROLLER-CONVENTIONS.md 참고
3. 템플릿 복사 → 수정
4. 체크리스트 확인
```

### Service 작성 시
```markdown
1. conventions/00-CONVENTIONS-CORE.md 읽기 (필수)
2. conventions/04-SERVICE-CONVENTIONS.md 참고
3. 템플릿 복사 → 수정
4. 체크리스트 확인
```

### Entity 작성 시
```markdown
1. conventions/00-CONVENTIONS-CORE.md 읽기 (필수)
2. conventions/06-ENTITY-CONVENTIONS.md 참고
3. ⚠️ Setter 절대 금지 확인!
4. 템플릿 복사 → 수정
5. 체크리스트 확인
```

---

## 📌 참고

- **Java**: 17 ~ 21
- **Spring Boot**: 3.2.x
- **코딩 스타일**: Google Java Style Guide
- **프로젝트 구조**: Domain-Driven
- **DTO**: Record (Java 17+) 사용

---

## 🎓 학습 순서 권장

1. [00-CONVENTIONS-CORE.md](./conventions/00-CONVENTIONS-CORE.md) - 핵심 규칙
2. [01-PROJECT-STRUCTURE.md](./conventions/01-PROJECT-STRUCTURE.md) - 프로젝트 구조
3. [06-ENTITY-CONVENTIONS.md](./conventions/06-ENTITY-CONVENTIONS.md) - Entity (중요!)
4. [07-DTO-CONVENTIONS.md](./conventions/07-DTO-CONVENTIONS.md) - DTO
5. [04-SERVICE-CONVENTIONS.md](./conventions/04-SERVICE-CONVENTIONS.md) - Service
6. [03-CONTROLLER-CONVENTIONS.md](./conventions/03-CONTROLLER-CONVENTIONS.md) - Controller
7. [05-REPOSITORY-CONVENTIONS.md](./conventions/05-REPOSITORY-CONVENTIONS.md) - Repository
8. [08-EXCEPTION-CONVENTIONS.md](./conventions/08-EXCEPTION-CONVENTIONS.md) - Exception

---

**모든 코드 작성 전에 [conventions/00-CONVENTIONS-CORE.md](./conventions/00-CONVENTIONS-CORE.md)를 먼저 읽으세요!** ⭐
