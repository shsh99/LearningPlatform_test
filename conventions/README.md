# Coding Conventions

> 효율적이고 일관된 풀스택 프로젝트 개발을 위한 코딩 컨벤션
>
> **Backend**: Spring Boot 3.2 + Java 17-21
>
> **Frontend**: React 18+ + TypeScript 5+

---

## 📚 문서 구조

### 🔵 Backend (Spring Boot + Java)

#### 🎯 시작하기

1. **[00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)** ⭐ **필수**
   - 모든 레이어에서 공통으로 적용되는 핵심 규칙
   - 코딩 스타일, 네이밍, 레이어 책임 등
   - **코드 작성 전 반드시 읽을 것**

2. **[01-PROJECT-STRUCTURE.md](./01-PROJECT-STRUCTURE.md)**
   - 프로젝트 구조 가이드
   - Domain-Driven 구조
   - 패키지 구성 및 의존성 규칙

#### 📖 레이어별 컨벤션

3. **[03-CONTROLLER-CONVENTIONS.md](./03-CONTROLLER-CONVENTIONS.md)**
   - HTTP 요청/응답 처리
   - RESTful API 규칙
   - Validation

4. **[04-SERVICE-CONVENTIONS.md](./04-SERVICE-CONVENTIONS.md)**
   - Business Logic
   - Transaction 관리
   - Entity ↔ DTO 변환

5. **[05-REPOSITORY-CONVENTIONS.md](./05-REPOSITORY-CONVENTIONS.md)**
   - 데이터 접근
   - Query Methods, JPQL
   - N+1 문제 해결

6. **[06-ENTITY-CONVENTIONS.md](./06-ENTITY-CONVENTIONS.md)**
   - 도메인 모델
   - **Setter 금지!**
   - 연관관계 매핑

7. **[07-DTO-CONVENTIONS.md](./07-DTO-CONVENTIONS.md)**
   - Request/Response DTO
   - Validation
   - Record 사용

8. **[08-EXCEPTION-CONVENTIONS.md](./08-EXCEPTION-CONVENTIONS.md)**
   - 예외 계층 구조
   - ErrorCode
   - GlobalExceptionHandler

---

### 🟢 Frontend (React + TypeScript)

#### 🎯 시작하기

10. **[10-REACT-TYPESCRIPT-CORE.md](./10-REACT-TYPESCRIPT-CORE.md)** ⭐ **필수**
    - React + TypeScript 핵심 규칙
    - 코딩 스타일, 네이밍, 타입 정의
    - 컴포넌트 작성 기본 규칙

11. **[11-REACT-PROJECT-STRUCTURE.md](./11-REACT-PROJECT-STRUCTURE.md)**
    - 프로젝트 폴더 구조
    - 파일 구성 및 네이밍
    - 절대 경로 설정

#### 📖 상세 컨벤션

12. **[12-REACT-COMPONENT-CONVENTIONS.md](./12-REACT-COMPONENT-CONVENTIONS.md)**
    - 컴포넌트 작성 규칙
    - Props 관리
    - 조건부 렌더링, 리스트 렌더링

13. **[13-REACT-STATE-MANAGEMENT.md](./13-REACT-STATE-MANAGEMENT.md)**
    - 상태 관리 전략
    - useState, useReducer, Context API
    - Zustand, React Query

14. **[14-REACT-API-INTEGRATION.md](./14-REACT-API-INTEGRATION.md)**
    - API 통신 규칙
    - Axios 설정, Interceptor
    - 에러 처리, 로딩 상태

---

### 🔄 Git & 협업

2. **[02-GIT-CONVENTIONS.md](./02-GIT-CONVENTIONS.md)** 🔄
   - Git 브랜치 전략
   - 커밋 메시지 규칙
   - PR 작성 가이드
   - 민감 정보 관리

9. **[09-GIT-SUBMODULE-CONVENTIONS.md](./09-GIT-SUBMODULE-CONVENTIONS.md)** 🔐
   - Submodule 설정 및 사용
   - 민감 정보 버전 관리
   - 팀 협업 설정

---

## 🚀 빠른 시작

### Backend 개발 시

**1단계**: [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md) 읽기 (필수)

**2단계**: 작성하는 레이어에 맞는 문서 참고

- **Controller**: [03-CONTROLLER-CONVENTIONS.md](./03-CONTROLLER-CONVENTIONS.md)
- **Service**: [04-SERVICE-CONVENTIONS.md](./04-SERVICE-CONVENTIONS.md)
- **Repository**: [05-REPOSITORY-CONVENTIONS.md](./05-REPOSITORY-CONVENTIONS.md)
- **Entity**: [06-ENTITY-CONVENTIONS.md](./06-ENTITY-CONVENTIONS.md)
- **DTO**: [07-DTO-CONVENTIONS.md](./07-DTO-CONVENTIONS.md)

### Frontend 개발 시

**1단계**: [10-REACT-TYPESCRIPT-CORE.md](./10-REACT-TYPESCRIPT-CORE.md) 읽기 (필수)

**2단계**: 필요에 따라 참고

- **프로젝트 구조**: [11-REACT-PROJECT-STRUCTURE.md](./11-REACT-PROJECT-STRUCTURE.md)
- **컴포넌트 작성**: [12-REACT-COMPONENT-CONVENTIONS.md](./12-REACT-COMPONENT-CONVENTIONS.md)
- **상태 관리**: [13-REACT-STATE-MANAGEMENT.md](./13-REACT-STATE-MANAGEMENT.md)
- **API 통신**: [14-REACT-API-INTEGRATION.md](./14-REACT-API-INTEGRATION.md)

---

## 🎯 핵심 원칙 요약

### Backend (Spring Boot + Java)

#### 1. Setter 금지 (Entity)
```java
// ❌ 금지
public void setName(String name) { }

// ✅ 비즈니스 메서드
public void updateName(String newName) { }
```

#### 2. Enum은 STRING 타입
```java
// ✅ 항상 STRING
@Enumerated(EnumType.STRING)
private UserStatus status;
```

#### 3. Transaction 관리
```java
// ✅ 클래스 레벨: 읽기 전용
@Transactional(readOnly = true)
public class UserService {
    @Transactional
    public void create() { }
}
```

#### 4. Entity ↔ DTO 변환
```java
// ✅ Entity → DTO
UserResponse.from(entity)

// ✅ DTO → Entity
User.create(request.name())
```

#### 5. 예외는 GlobalExceptionHandler가 처리
```java
// ✅ Service에서 던지기만
throw new UserNotFoundException(id);
```

---

### Frontend (React + TypeScript)

#### 1. any 타입 금지
```typescript
// ❌ 금지
const data: any = {};

// ✅ 명시적 타입 또는 unknown
const data: unknown = {};
```

#### 2. Props 타입 명시
```typescript
// ✅ Props 타입 명시
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};
```

#### 3. 상태 불변성 유지
```typescript
// ✅ 불변성 유지
setForm(prev => ({
  ...prev,
  name: 'New Name',
}));

// ❌ 직접 수정 금지
form.name = 'New Name'; // ❌
```

#### 4. 조건부 렌더링 명확히
```typescript
// ✅ Early return
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

return <div>{data}</div>;
```

#### 5. 리스트에는 고유한 key
```typescript
// ✅ 고유한 key 사용
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ❌ index를 key로 사용 금지
{users.map((user, index) => (
  <UserCard key={index} user={user} /> // ❌
))}
```

---

## 📝 체크리스트

### Backend

- [ ] Google Java Style Guide 준수
- [ ] 적절한 네이밍 (PascalCase, camelCase)
- [ ] 필수 Annotation 사용
- [ ] 레이어 책임 준수
- [ ] Setter 사용 안 함 (Entity)
- [ ] Enum은 STRING 타입
- [ ] Transaction 적절히 관리
- [ ] Entity ↔ DTO 변환 규칙 준수

### Frontend

- [ ] TypeScript strict 모드 활성화
- [ ] any 타입 사용 안 함
- [ ] Props 타입 명시
- [ ] 상태 불변성 유지
- [ ] 조건부 렌더링 명확히
- [ ] 리스트 렌더링 시 고유한 key 사용
- [ ] Import 순서 정리
- [ ] 적절한 상태 관리 도구 선택

---

## 🛠️ 기술 스택

### Backend
```
Java: 17 ~ 21
Spring Boot: 3.2.x
JPA/Hibernate
Lombok
Validation
```

### Frontend
```
React: 18+
TypeScript: 5+
Vite (or CRA)
React Query (or SWR)
Zustand (or Redux)
Axios
```

---

## 📌 참고

### Backend
- **Google Java Style Guide** 기반
- **Domain-Driven 구조** 사용
- **Record (Java 17+)** 적극 활용
- **Lombok** 사용 (단, Entity에 @Setter 금지)

### Frontend
- **Airbnb Style Guide** 기반
- **컴포넌트 기반 아키텍처**
- **함수형 컴포넌트** 사용
- **TypeScript strict 모드** 활성화

---

## 📖 추가 참고 자료

### Backend
- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/3.2.x/reference/html/)
- [JPA Best Practices](https://vladmihalcea.com/tutorials/hibernate/)

### Frontend
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## 💡 문의 및 개선

컨벤션에 대한 문의나 개선 제안은 팀 리드에게 문의하세요.
