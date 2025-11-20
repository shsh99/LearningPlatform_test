# Spring Boot 3.2 + Java 17-21 Coding Conventions

> 효율적이고 일관된 Spring Boot 프로젝트 개발을 위한 코딩 컨벤션

---

## 📚 문서 구조

### 🎯 시작하기

1. **[00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)** ⭐ **필수**
   - 모든 레이어에서 공통으로 적용되는 핵심 규칙
   - 코딩 스타일, 네이밍, 레이어 책임 등
   - **코드 작성 전 반드시 읽을 것**

2. **[01-PROJECT-STRUCTURE.md](./01-PROJECT-STRUCTURE.md)**
   - 프로젝트 구조 가이드
   - Domain-Driven 구조
   - 패키지 구성 및 의존성 규칙

3. **[02-GIT-CONVENTIONS.md](./02-GIT-CONVENTIONS.md)** 🔄
   - Git 브랜치 전략
   - 커밋 메시지 규칙
   - PR 작성 가이드
   - 민감 정보 관리

4. **[09-GIT-SUBMODULE-CONVENTIONS.md](./09-GIT-SUBMODULE-CONVENTIONS.md)** 🔐
   - Submodule 설정 및 사용
   - 민감 정보 버전 관리
   - 팀 협업 설정

### 📖 레이어별 컨벤션

작성하는 레이어에 맞는 문서를 참고하세요:

5. **[03-CONTROLLER-CONVENTIONS.md](./03-CONTROLLER-CONVENTIONS.md)**
   - HTTP 요청/응답 처리
   - RESTful API 규칙
   - Validation

6. **[04-SERVICE-CONVENTIONS.md](./04-SERVICE-CONVENTIONS.md)**
   - Business Logic
   - Transaction 관리
   - Entity ↔ DTO 변환

7. **[05-REPOSITORY-CONVENTIONS.md](./05-REPOSITORY-CONVENTIONS.md)**
   - 데이터 접근
   - Query Methods, JPQL
   - N+1 문제 해결

8. **[06-ENTITY-CONVENTIONS.md](./06-ENTITY-CONVENTIONS.md)**
   - 도메인 모델
   - **Setter 금지!**
   - 연관관계 매핑

9. **[07-DTO-CONVENTIONS.md](./07-DTO-CONVENTIONS.md)**
   - Request/Response DTO
   - Validation
   - Record 사용

10. **[08-EXCEPTION-CONVENTIONS.md](./08-EXCEPTION-CONVENTIONS.md)**
    - 예외 계층 구조
    - ErrorCode
    - GlobalExceptionHandler

---

## 🚀 빠른 시작

### 1단계: 핵심 규칙 숙지
```
먼저 00-CONVENTIONS-CORE.md를 읽고 핵심 규칙을 이해하세요.
```

### 2단계: 레이어 작성 시 참고

**Controller 작성 시:**
- [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md) (항상)
- [03-CONTROLLER-CONVENTIONS.md](./03-CONTROLLER-CONVENTIONS.md)

**Service 작성 시:**
- [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md) (항상)
- [04-SERVICE-CONVENTIONS.md](./04-SERVICE-CONVENTIONS.md)

**Entity 작성 시:**
- [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md) (항상)
- [06-ENTITY-CONVENTIONS.md](./06-ENTITY-CONVENTIONS.md)

---

## 🎯 핵심 원칙 요약

### 1. Setter 금지 (Entity)
```java
// ❌ 금지
public void setName(String name) { }

// ✅ 비즈니스 메서드
public void updateName(String newName) { }
```

### 2. Enum은 STRING 타입
```java
// ✅ 항상 STRING
@Enumerated(EnumType.STRING)
private UserStatus status;
```

### 3. Transaction 관리
```java
// ✅ 클래스 레벨: 읽기 전용
@Transactional(readOnly = true)
public class UserService {

    // 쓰기 작업만 @Transactional
    @Transactional
    public void create() { }
}
```

### 4. Entity ↔ DTO 변환
```java
// ✅ Entity → DTO
UserResponse.from(entity)

// ✅ DTO → Entity
User.create(request.name())
```

### 5. 예외는 GlobalExceptionHandler가 처리
```java
// ✅ Service에서 던지기만
throw new UserNotFoundException(id);

// ❌ Controller에서 try-catch 금지
```

---

## 📝 체크리스트

코드 작성 후 확인:

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

---

## 🛠️ 기술 스택

```
Java: 17 ~ 21
Spring Boot: 3.2.x
JPA/Hibernate
Lombok
Validation
```

---

## 📌 참고

- 모든 컨벤션은 **Google Java Style Guide** 기반
- **Domain-Driven 구조** 사용
- **Record (Java 17+)** 적극 활용
- **Lombok** 사용 (단, Entity에 @Setter 금지)

---

## 📖 추가 참고 자료

- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/3.2.x/reference/html/)
- [JPA Best Practices](https://vladmihalcea.com/tutorials/hibernate/)

---

## 💡 문의 및 개선

컨벤션에 대한 문의나 개선 제안은 팀 리드에게 문의하세요.
