# LearningPlatform - AI 작업 가이드

> **핵심 원칙**: 이 문서(200줄 이하)만으로 대부분의 작업 시작 가능. 부족하면 부록 참조.
> **🚨 필수 작업 규칙**: 모든 작업은 **반드시 계획 먼저 제시** → 승인 → 순차 진행 → 완료 보고 ([상세](./docs/templates/task-workflow.md))

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **Backend** | Spring Boot 3.2.11, Java 21 |
| **Frontend** | React 19.2.0, TypeScript 5.9.3, Vite 7.2.4, TailwindCSS |
| **Database** | MySQL 8.0 (prod), H2 (dev) |
| **Infra** | AWS (ECS, RDS, S3, CloudFront), Docker |
| **인증** | JWT (Access + Refresh Token) |

> 상세 버전은 [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) 참조

### 저장소 구조
| 구조 | 가이드 |
|------|--------|
| Monorepo | [MONOREPO.md](./MONOREPO.md) |
| 분리형 | [SEPARATED-REPOS.md](./SEPARATED-REPOS.md) |

---

## 핵심 규칙 (Must-Know)

### Backend
```
✅ Entity: Setter 금지 → 비즈니스 메서드 사용
✅ Service: @Transactional(readOnly=true) 클래스 레벨
✅ Controller: try-catch 금지 → GlobalExceptionHandler
✅ DTO: Java Record + from() 정적 팩토리
✅ Enum: @Enumerated(EnumType.STRING)
```

### Frontend
```
✅ any 타입 금지 → 명시적 타입 정의
✅ 서버 상태: React Query (useState는 UI 상태만)
✅ API: Axios Instance + handleApiError
✅ 컴포넌트: Props Destructuring + Early Return
```

---

## 컨벤션 로딩 (작업별 선택)

| 작업 | 필수 컨벤션 | 부족하면 |
|------|------------|---------|
| 프로젝트 구조 | `01-PROJECT-STRUCTURE` | 00 참조 |
| Git | `02-GIT-CONVENTIONS` | - |
| Controller | `03-CONTROLLER-CONVENTIONS` | 07 참조 |
| Service | `04-SERVICE` | 07, 08 참조 |
| Repository | `05-REPOSITORY` | 06 참조 |
| Entity | `06-ENTITY` | 00 참조 |
| DTO | `07-DTO` | 03 참조 |
| Exception | `08-EXCEPTION` | - |
| Git Submodule | `09-GIT-SUBMODULE` | SEPARATED-REPOS.md |
| React Core | `10-REACT-TYPESCRIPT-CORE` | - |
| React 구조 | `11-REACT-PROJECT-STRUCTURE` | - |
| Component | `12-REACT-COMPONENT-CONVENTIONS` | 10 참조 |
| State 관리 | `13-STATE-MANAGEMENT` | - |
| API Service | `14-API-INTEGRATION` | 13 참조 |
| Backend Test | `15-BACKEND-TEST` | - |
| Frontend Test | `16-FRONTEND-TEST` | - |
| Design/UI | `17-DESIGN` | design.md 참조 |
| Docker | `18-DOCKER` | infrastructure.md |
| Database | `19-DATABASE` | database.md |
| AWS 배포 | `20-AWS` | infrastructure.md |
| 보안 | `21-SECURITY` | - |
| 성능 | `22-PERFORMANCE` | - |
| 외부 API | `23-EXTERNAL-API` | - |

> 컨벤션 전체 목록이 필요하면 → [conventions/README.md](./conventions/README.md)

---

## 작업 순서

**Backend CRUD**: Entity → Repository → DTO → Exception → Service → Controller → Test

**Frontend 페이지**: Types → API Service → React Query Hook → Component → Test

**디자인 (MCP)**: Figma 조회 → 토큰 확인 → 구현 → 비교 검증

---

## 프로젝트 구조

```
backend/.../domain/
├── user/           # controller, service, repository, entity, dto, exception
├── course/
└── enrollment/
global/             # config, exception, common

frontend/src/
├── pages/          # 페이지 컴포넌트
├── components/     # 재사용 컴포넌트 (common, layout)
├── services/       # API 호출
├── hooks/          # Custom Hooks (React Query 래핑)
├── stores/         # 전역 상태 (필요시)
├── types/          # TypeScript 타입
└── utils/          # 유틸리티 함수
```

> 상세 구조가 필요하면 → [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)

---

## 자주 하는 실수

| 실수 | 해결 |
|------|------|
| Entity Setter | `updateXxx()` 메서드 |
| Controller try-catch | GlobalExceptionHandler |
| DTO toEntity() | Entity.create() |
| useState 서버상태 | React Query |
| N+1 쿼리 | Fetch Join |

---

## Git

**Commit**: `feat(backend): Add User API` / `fix(frontend): Login bug`

**Branch**: main → dev → feat/* / fix/*

---

## 참조 문서 (부족하면 여기서)

| 분류 | 문서 |
|------|------|
| **환경** | [MONOREPO](./MONOREPO.md), [SEPARATED-REPOS](./SEPARATED-REPOS.md), [PROJECT_CONTEXT](./PROJECT_CONTEXT.md) |
| **컨텍스트** | [architecture](./docs/context/architecture.md), [database](./docs/context/database.md), [api](./docs/context/api.md), [pages](./docs/context/pages.md), [design](./docs/context/design.md), [infrastructure](./docs/context/infrastructure.md) |
| **템플릿** | [task-workflow](./docs/templates/task-workflow.md), [mcdonaldization](./docs/templates/mcdonaldization.md), [code-review](./docs/templates/code-review-checklist.md), [ADR](./docs/adr/000-template.md) |
| **기타** | [troubleshooting](./docs/context/troubleshooting.md), [glossary](./docs/context/glossary.md), [feature-roadmap](./docs/context/feature-roadmap.md) |

---

## 🚨 AI 작업 규칙 (필수)

```
⚠️ 코드 작성 전 반드시 계획부터 제시할 것!
```

1. **계획 제시** → 작업 목록 테이블로 보여주기
2. **승인 대기** → 사용자 확인 후 진행
3. **순차 작업** → TodoWrite로 추적하며 진행
4. **완료 보고** → 결과 요약 제시

> 단순 질문/조회는 예외. 코드 생성/수정 작업은 무조건 계획 먼저.

---

## 워크플로우

**7단계**: 요구사항 → UX → 의존성 → 계획 → 리스크 → 구현 → 테스트

**MoSCoW**: 🔴Must → 🟡Should → 🟢Could (⚪Won't 제외)

> 상세 → [맥도날드화](./docs/templates/mcdonaldization.md) | [워크플로우](./.claude/templates/workflow-checklist.md) | [MoSCoW](./.claude/templates/moscow-priority.md)

---

**웬만한 작업은 이 문서만으로 시작 가능. 부족하면 위 참조 문서에서 찾으세요.**
