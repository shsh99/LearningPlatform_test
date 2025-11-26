# Coding Conventions

> 효율적이고 일관된 풀스택 프로젝트 개발을 위한 코딩 컨벤션
>
> **Backend**: Spring Boot 3.2 + Java 17-21
>
> **Frontend**: React 19 + TypeScript 5

---

## 📚 문서 구조

### 🔵 Backend (Spring Boot + Java)

#### 🎯 시작하기

1. **[00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)** ⭐ **필수**
   - 모든 레이어에서 공통으로 적용되는 핵심 규칙

2. **[01-PROJECT-STRUCTURE.md](./01-PROJECT-STRUCTURE.md)**
   - 프로젝트 구조, Domain-Driven 설계

#### 📖 레이어별 컨벤션

3. **[03-CONTROLLER-CONVENTIONS.md](./03-CONTROLLER-CONVENTIONS.md)** - HTTP, RESTful API
4. **[04-SERVICE-CONVENTIONS.md](./04-SERVICE-CONVENTIONS.md)** - Business Logic, Transaction
5. **[05-REPOSITORY-CONVENTIONS.md](./05-REPOSITORY-CONVENTIONS.md)** - 데이터 접근, N+1 해결
6. **[06-ENTITY-CONVENTIONS.md](./06-ENTITY-CONVENTIONS.md)** - 도메인 모델, **Setter 금지!**
7. **[07-DTO-CONVENTIONS.md](./07-DTO-CONVENTIONS.md)** - Request/Response, Record
8. **[08-EXCEPTION-CONVENTIONS.md](./08-EXCEPTION-CONVENTIONS.md)** - 예외 계층, ErrorCode

---

### 🟢 Frontend (React + TypeScript)

#### 🎯 시작하기

10. **[10-REACT-TYPESCRIPT-CORE.md](./10-REACT-TYPESCRIPT-CORE.md)** ⭐ **필수**
    - React + TypeScript 핵심 규칙

11. **[11-REACT-PROJECT-STRUCTURE.md](./11-REACT-PROJECT-STRUCTURE.md)**
    - 프로젝트 폴더 구조

#### 📖 상세 컨벤션

12. **[12-REACT-COMPONENT-CONVENTIONS.md](./12-REACT-COMPONENT-CONVENTIONS.md)** - 컴포넌트 작성
13. **[13-REACT-STATE-MANAGEMENT.md](./13-REACT-STATE-MANAGEMENT.md)** - 상태 관리
14. **[14-REACT-API-INTEGRATION.md](./14-REACT-API-INTEGRATION.md)** - API 통신, Axios

---

### 🧪 Testing

15. **[15-BACKEND-TEST-CONVENTIONS.md](./15-BACKEND-TEST-CONVENTIONS.md)** - JUnit5, MockMvc
16. **[16-FRONTEND-TEST-CONVENTIONS.md](./16-FRONTEND-TEST-CONVENTIONS.md)** - Jest, RTL, MSW

---

### 🔄 Git & 협업

2. **[02-GIT-CONVENTIONS.md](./02-GIT-CONVENTIONS.md)** - 브랜치, 커밋, PR
9. **[09-GIT-SUBMODULE-CONVENTIONS.md](./09-GIT-SUBMODULE-CONVENTIONS.md)** - 민감 정보 관리

---

### 📦 Monorepo

**[../MONOREPO.md](../MONOREPO.md)** - 프로젝트 구조, 환경 설정, 배포

---

## 📖 참고 자료

- **Backend**: [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html) | [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/3.2.x/reference/html/)
- **Frontend**: [Airbnb React/JSX Guide](https://airbnb.io/javascript/react/) | [React Docs](https://react.dev/)
