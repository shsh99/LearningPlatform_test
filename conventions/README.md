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

## 📖 참고 자료

**Backend**: [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html) | [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/3.2.x/reference/html/)

**Frontend**: [Airbnb React/JSX Guide](https://airbnb.io/javascript/react/) | [React Docs](https://react.dev/) | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
