# LearningPlatform - AI 작업 가이드

> **핵심 원칙**: 필요한 컨벤션만 선택적으로 읽고, TodoWrite로 작업 추적

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **이름** | LearningPlatform (교육 플랫폼) |
| **구조** | Monorepo - `backend/` + `frontend/` |
| **Backend** | Spring Boot 3.2, Java 17-21, H2 (dev) |
| **Frontend** | React 19, TypeScript 5, Vite, TailwindCSS |
| **인증** | JWT (Access + Refresh Token) |

---

## 핵심 규칙 (Must-Know)

### Backend 필수 규칙
```
✅ Entity: Setter 금지 → 비즈니스 메서드 사용
✅ Service: @Transactional(readOnly=true) 클래스 레벨
✅ Controller: try-catch 금지 → GlobalExceptionHandler
✅ DTO: Java Record + from() 정적 팩토리
✅ Enum: @Enumerated(EnumType.STRING)
```

### Frontend 필수 규칙
```
✅ any 타입 금지 → 명시적 타입 정의
✅ 서버 상태: React Query (useState 금지)
✅ API: Axios Instance + handleApiError
✅ 컴포넌트: Props Destructuring + Early Return
```

---

## 컨벤션 로딩 가이드

### 작업별 필수 컨벤션

| 작업 유형 | 필수 읽기 | 참고 |
|----------|----------|------|
| **Entity** | `06-ENTITY-CONVENTIONS.md` | 00 |
| **Repository** | `05-REPOSITORY-CONVENTIONS.md` | 06 |
| **Service** | `04-SERVICE-CONVENTIONS.md` | 07, 08 |
| **Controller** | `03-CONTROLLER-CONVENTIONS.md` | 07 |
| **DTO** | `07-DTO-CONVENTIONS.md` | 03 |
| **Exception** | `08-EXCEPTION-CONVENTIONS.md` | - |
| **Component** | `12-REACT-COMPONENT-CONVENTIONS.md` | 10 |
| **API Service** | `14-REACT-API-INTEGRATION.md` | 13 |
| **State** | `13-REACT-STATE-MANAGEMENT.md` | 10 |
| **Backend Test** | `15-BACKEND-TEST-CONVENTIONS.md` | - |
| **Frontend Test** | `16-FRONTEND-TEST-CONVENTIONS.md` | - |

> 💡 `00-CONVENTIONS-CORE.md` (Backend), `10-REACT-TYPESCRIPT-CORE.md` (Frontend) 는 공통 규칙

---

## 작업 순서

### Backend CRUD
```
Entity → Repository → DTO → Exception → Service → Controller → Test
```

### Frontend 페이지
```
Types → API Service → React Query Hook → Component → Test
```

---

## 프로젝트 구조

```
backend/src/main/java/com/example/demo/
├── domain/           # 도메인별 패키지
│   ├── user/         # User 도메인
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── exception/
│   ├── course/       # Course 도메인
│   └── enrollment/   # Enrollment 도메인
└── global/           # 공통 설정
    ├── config/       # Security, CORS 등
    ├── exception/    # GlobalExceptionHandler
    └── common/       # BaseEntity, 유틸리티

frontend/src/
├── components/       # 공통 컴포넌트
├── pages/            # 페이지 컴포넌트
├── services/         # API 서비스
├── hooks/            # Custom Hooks
├── types/            # TypeScript 타입
└── utils/            # 유틸리티
```

---

## 주요 API Endpoints

| 기능 | Method | Endpoint |
|------|--------|----------|
| 로그인 | POST | `/api/auth/login` |
| 회원가입 | POST | `/api/auth/register` |
| 토큰 갱신 | POST | `/api/auth/refresh` |
| 사용자 목록 | GET | `/api/users` |
| 강의 목록 | GET | `/api/courses` |
| 강의 차수 | GET | `/api/courses/{id}/terms` |
| 수강 신청 | POST | `/api/enrollments` |

---

## 자주 하는 실수

| 실수 | 해결책 |
|------|--------|
| Entity에 Setter 사용 | `updateXxx()` 비즈니스 메서드로 대체 |
| Controller에서 try-catch | GlobalExceptionHandler에 위임 |
| DTO에 toEntity() | Entity.create() 정적 팩토리 사용 |
| EnumType.ORDINAL | EnumType.STRING 사용 |
| Frontend any 타입 | 명시적 인터페이스/타입 정의 |
| useState로 서버 상태 | React Query useQuery/useMutation |
| N+1 쿼리 | Fetch Join 또는 @EntityGraph |

---

## Git 컨벤션

### Commit 형식
```
feat(backend): Add User CRUD API
fix(frontend): Resolve login state bug
refactor(backend): Improve UserService logic
test: Add UserController unit tests
```

### Branch 전략
- `main`: 프로덕션
- `dev`: 개발 통합
- `feat/*`: 기능 개발
- `fix/*`: 버그 수정

---

## 참조 문서

### 프로젝트 문서
- [MONOREPO.md](./MONOREPO.md) - 환경 설정, 실행 방법, 배포
- [conventions/README.md](./conventions/README.md) - 컨벤션 전체 목록

### 도메인 컨텍스트 (상세 정보)
- [docs/context/database.md](./docs/context/database.md) - DB 스키마, ERD
- [docs/context/api.md](./docs/context/api.md) - API 상세 명세
- [docs/context/pages.md](./docs/context/pages.md) - 페이지별 기능 명세

### 핵심 컨벤션 (자주 참조)
| Backend | Frontend |
|---------|----------|
| [00-CONVENTIONS-CORE](./conventions/00-CONVENTIONS-CORE.md) | [10-REACT-TYPESCRIPT-CORE](./conventions/10-REACT-TYPESCRIPT-CORE.md) |
| [04-SERVICE](./conventions/04-SERVICE-CONVENTIONS.md) | [12-COMPONENT](./conventions/12-REACT-COMPONENT-CONVENTIONS.md) |
| [06-ENTITY](./conventions/06-ENTITY-CONVENTIONS.md) | [14-API-INTEGRATION](./conventions/14-REACT-API-INTEGRATION.md) |

---

## 작업 시작 전 체크리스트

1. [ ] 작업 유형 파악 → 필요한 컨벤션 확인
2. [ ] TodoWrite로 작업 계획 수립
3. [ ] 의존성 순서대로 진행 (하위 레이어부터)
4. [ ] 완료 시 TodoWrite 상태 업데이트

---

**상세 컨텍스트가 필요하면 `docs/context/` 폴더의 도메인별 문서를 참조하세요.**
