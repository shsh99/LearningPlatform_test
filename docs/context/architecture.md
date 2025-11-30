# Architecture Context - 프로젝트 구조 & 모듈 관계

> 프로젝트의 전체 구조와 모듈 간 관계를 설명하는 문서
> **AI가 작업 전 반드시 참조해야 하는 핵심 컨텍스트**

---

## 이 문서를 읽어야 할 때

```
✅ 새 기능 개발 전 전체 구조 파악
✅ 모듈 간 의존성 이해 필요 시
✅ 어디에 코드를 작성해야 할지 모를 때
✅ 기존 모듈을 확장/수정할 때
```

---

## 1. 프로젝트 개요

### 서비스 설명
> (프로젝트가 무엇을 하는 서비스인지 1-2문장으로)

예: "교육 플랫폼 - 강사가 강의를 등록하고, 수강생이 수강 신청하는 서비스"

### 핵심 도메인
| 도메인 | 설명 | 주요 기능 |
|--------|------|----------|
| User | 사용자 관리 | 회원가입, 로그인, 프로필 |
| Course | 강의 관리 | 강의 CRUD, 강의 차수 |
| Enrollment | 수강 신청 | 신청, 취소, 수강 현황 |

---

## 2. 시스템 아키텍처

### 전체 흐름
```
[사용자] → [Frontend] → [Backend API] → [Database]
              │              │
              │              ├→ [External APIs]
              │              └→ [File Storage]
              │
              └→ [CDN/Static Files]
```

### 계층 구조 (Backend)
```
Controller (HTTP 요청/응답)
    ↓
Service (비즈니스 로직)
    ↓
Repository (데이터 접근)
    ↓
Entity (도메인 모델)
```

---

## 3. 모듈 구조

### Backend 모듈
```
domain/
├── user/           # 사용자 도메인
│   ├── entity/     # User, Role
│   ├── service/    # UserService
│   ├── repository/ # UserRepository
│   ├── controller/ # UserController
│   ├── dto/        # Request/Response
│   └── exception/  # UserNotFoundException
│
├── course/         # 강의 도메인
│   ├── entity/     # Course, CourseTerm
│   └── ...
│
├── enrollment/     # 수강 신청 도메인
│   └── ...
│
└── (추가 도메인...)

global/
├── config/         # 설정 (Security, CORS, JPA)
├── exception/      # 글로벌 예외 처리
├── common/         # 공통 (BaseEntity, 유틸리티)
└── security/       # JWT, 인증 필터
```

### Frontend 모듈
```
src/
├── pages/          # 페이지 컴포넌트
│   ├── auth/       # 로그인, 회원가입
│   ├── course/     # 강의 목록, 상세
│   └── mypage/     # 마이페이지
│
├── components/     # 재사용 컴포넌트
│   ├── common/     # Button, Input, Modal
│   └── layout/     # Header, Footer, Sidebar
│
├── services/       # API 호출
├── hooks/          # Custom Hooks
├── stores/         # 상태 관리 (React Query)
└── types/          # TypeScript 타입
```

---

## 4. 모듈 간 의존성

### 도메인 의존성 다이어그램
```
┌─────────────┐
│    User     │ ←──────────────────────────┐
└──────┬──────┘                            │
       │ 1:N                               │
       ▼                                   │
┌─────────────┐      ┌─────────────┐       │
│   Course    │ ←────│ Enrollment  │───────┘
└─────────────┘  N:1 └─────────────┘
       │ 1:N              │
       ▼                  │
┌─────────────┐           │
│ CourseTerm  │ ←─────────┘
└─────────────┘     N:1
```

### 의존성 규칙
```
✅ 허용:
- Enrollment → User, Course (참조)
- Course → User (강사 참조)
- Service → 다른 Service (필요시)

❌ 금지:
- Entity → Service (역방향 의존)
- Controller → Repository (직접 호출)
- 순환 의존 (A → B → A)
```

---

## 5. 핵심 비즈니스 로직

### 수강 신청 프로세스
```
1. 사용자가 강의 차수 선택
2. 수강 신청 가능 여부 확인
   - 이미 신청했는지?
   - 정원 초과인지?
   - 신청 기간인지?
3. Enrollment 생성
4. 알림 발송 (선택)
```

### 인증 흐름
```
1. 로그인 → JWT Access Token + Refresh Token 발급
2. API 요청 시 Access Token 검증
3. 만료 시 Refresh Token으로 재발급
4. Refresh Token도 만료 시 재로그인
```

---

## 6. 데이터 흐름 예시

### 강의 목록 조회
```
[Frontend]                    [Backend]                    [Database]
     │                            │                            │
     │ GET /api/courses           │                            │
     │ ─────────────────────────▶ │                            │
     │                            │ SELECT * FROM courses      │
     │                            │ ─────────────────────────▶ │
     │                            │ ◀───────────────────────── │
     │                            │                            │
     │ ◀───────────────────────── │                            │
     │ { courses: [...] }         │                            │
```

### 수강 신청
```
[Frontend]                    [Backend]                    [Database]
     │ POST /api/enrollments      │                            │
     │ { courseTermId: 1 }        │                            │
     │ ─────────────────────────▶ │                            │
     │                            │ 1. 사용자 확인              │
     │                            │ 2. 중복 신청 확인           │
     │                            │ 3. 정원 확인               │
     │                            │ 4. INSERT enrollment       │
     │                            │ ─────────────────────────▶ │
     │ ◀───────────────────────── │                            │
     │ 201 Created                │                            │
```

---

## 7. 확장 포인트

### 새 도메인 추가 시
```
1. domain/새도메인/ 폴더 생성
2. Entity → Repository → Service → Controller 순서로 구현
3. 관련 컨벤션 참조 (06-ENTITY, 04-SERVICE 등)
4. 이 문서에 모듈 관계 업데이트
```

### 기존 도메인 수정 시
```
1. 이 문서에서 의존성 관계 확인
2. 영향받는 모듈 파악
3. 테스트 범위 결정
```

---

## 8. 기술 스택별 역할

| 기술 | 역할 | 위치 |
|------|------|------|
| Spring Security | 인증/인가 | global/security/ |
| JPA/Hibernate | ORM | domain/*/repository/ |
| React Query | 서버 상태 관리 | Frontend hooks/ |
| Axios | HTTP 클라이언트 | Frontend services/ |

---

## 관련 문서

- 상세 DB 스키마 → [database.md](./database.md)
- API 명세 → [api.md](./api.md)
- 인프라 구성 → [infrastructure.md](./infrastructure.md)

---

> **이 문서를 업데이트해야 할 때:**
> - 새 도메인/모듈 추가 시
> - 모듈 간 의존성 변경 시
> - 핵심 비즈니스 로직 변경 시
