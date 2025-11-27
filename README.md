# LearningPlatform AI 개발 가이드 문서

> AI(Claude)와 협업하여 일관되고 표준화된 개발을 진행하기 위한 컨벤션 및 워크플로우 문서 모음

---

## 프로젝트 소개

이 저장소는 **LearningPlatform**(교육 플랫폼) 프로젝트를 AI와 함께 개발하기 위해 만들어진 **개발 가이드 문서**입니다.

### 목적

- AI(Claude Code)가 프로젝트의 컨텍스트를 정확히 이해하고 일관된 코드를 생성하도록 지원
- 개발자와 AI 간의 원활한 협업을 위한 표준화된 작업 프로세스 정의
- 프로젝트 전반의 코딩 컨벤션과 아키텍처 가이드라인 제공

### 핵심 철학: 맥도날드화 원칙

| 원칙 | 설명 | 적용 방식 |
|------|------|----------|
| **효율성** | 최적의 방법으로 목표 달성 | 필요한 컨벤션만 선택적 로딩 |
| **계산 가능성** | 결과를 측정 가능하게 | PRD 템플릿으로 범위 명확화 |
| **예측 가능성** | 동일 입력 → 동일 결과 | 7단계 워크플로우 일관 적용 |
| **통제** | 규칙 기반 판단 | MoSCoW 우선순위로 범위 제한 |

---

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| **Backend** | Spring Boot / Java | 3.2.11 / 21 |
| **Frontend** | React / TypeScript / Vite | 19.2.0 / 5.9.3 / 7.2.4 |
| **Styling** | TailwindCSS | - |
| **Database** | MySQL (prod) / H2 (dev) | 8.0 |
| **Infra** | AWS (ECS, RDS, S3, CloudFront) | - |
| **인증** | JWT (Access + Refresh Token) | - |

---

## 문서 구조

```
📁 docss/
├── 📄 CLAUDE.md                 # AI 작업 가이드 (핵심 진입점)
├── 📄 PROJECT_CONTEXT.md        # 프로젝트 컨텍스트 & 현재 상태
├── 📄 MONOREPO.md               # 모노레포 설정 가이드
├── 📄 SEPARATED-REPOS.md        # 분리형 저장소 설정 가이드
│
├── 📁 conventions/              # 코딩 컨벤션 (24개)
│   ├── 00-CONVENTIONS-CORE.md   # 공통 핵심 규칙
│   ├── 01~09: Backend 컨벤션
│   ├── 10~16: Frontend 컨벤션
│   ├── 17~20: Infrastructure 컨벤션
│   └── 21~23: 품질 관련 컨벤션
│
├── 📁 docs/context/             # 프로젝트 컨텍스트
│   ├── architecture.md          # 시스템 아키텍처
│   ├── database.md              # DB 스키마
│   ├── api.md                   # API 명세
│   ├── pages.md                 # 페이지 기능 정의
│   ├── design.md                # 디자인 시스템
│   ├── infrastructure.md        # 인프라 구성
│   ├── troubleshooting.md       # 문제 해결 가이드
│   └── glossary.md              # 용어 사전
│
├── 📁 docs/adr/                 # 아키텍처 결정 기록
│   └── 000-template.md          # ADR 템플릿
│
└── 📁 templates/                # 작업 템플릿
    ├── task-workflow.md         # AI 작업 진행 규칙
    ├── workflow-checklist.md    # 7단계 워크플로우 체크리스트
    ├── mcdonaldization.md       # 맥도날드화 원칙
    ├── moscow-priority.md       # MoSCoW 우선순위 가이드
    ├── prd.md                   # 기능 기획서 템플릿
    └── code-review-checklist.md # 코드 리뷰 체크리스트
```

---

## 컨벤션 목록

### Backend (00-09)

| # | 컨벤션 | 설명 |
|---|--------|------|
| 00 | CONVENTIONS-CORE | 공통 핵심 규칙 |
| 01 | PROJECT-STRUCTURE | 프로젝트 구조 |
| 02 | GIT-CONVENTIONS | Git 브랜치, 커밋 메시지 |
| 03 | CONTROLLER | REST API, HTTP 규칙 |
| 04 | SERVICE | 비즈니스 로직, 트랜잭션 |
| 05 | REPOSITORY | 데이터 접근, N+1 해결 |
| 06 | ENTITY | 도메인 모델, Setter 금지 |
| 07 | DTO | Request/Response, Record |
| 08 | EXCEPTION | 예외 처리, ErrorCode |
| 09 | GIT-SUBMODULE | 민감 정보 관리 |

### Frontend (10-16)

| # | 컨벤션 | 설명 |
|---|--------|------|
| 10 | REACT-TYPESCRIPT-CORE | React+TS 핵심 규칙 |
| 11 | REACT-PROJECT-STRUCTURE | 폴더 구조 |
| 12 | REACT-COMPONENT | 컴포넌트 작성 규칙 |
| 13 | REACT-STATE-MANAGEMENT | 상태 관리 (React Query) |
| 14 | REACT-API-INTEGRATION | API 통신, Axios |
| 15 | BACKEND-TEST | JUnit5, MockMvc |
| 16 | FRONTEND-TEST | Vitest, React Testing Library |

### Infrastructure & 품질 (17-23)

| # | 컨벤션 | 설명 |
|---|--------|------|
| 17 | DESIGN | TailwindCSS, 디자인 시스템 |
| 18 | DOCKER | Docker, docker-compose |
| 19 | DATABASE | MySQL, 스키마 설계 |
| 20 | AWS | ECS, RDS, S3, CI/CD |
| 21 | SECURITY | 인증, 보안, 취약점 방지 |
| 22 | PERFORMANCE | N+1, 캐싱, 최적화 |
| 23 | EXTERNAL-API | 외부 연동, 재시도, 타임아웃 |

---

## AI 작업 워크플로우

### 필수 작업 규칙

```
⚠️ 모든 코드 작업은 반드시 [계획 → 승인 → 진행 → 완료 보고] 순서로 진행
```

### 작업 흐름

```
1. 📋 작업 계획 제시   ← AI가 먼저 계획을 테이블로 제시
2. ✅ 사용자 승인      ← 계획 확인 후 승인
3. 🔨 순차 작업       ← TodoWrite로 진행 상황 추적
4. 📝 완료 보고       ← 결과 요약 및 다음 단계 제안
```

### 7단계 개발 워크플로우

```
요구사항 분석 → UX 설계 → 의존성 분석 → 구현 계획 → 리스크 분석 → 구현 → 테스트
```

### MoSCoW 우선순위

| 레벨 | 의미 | AI 지시 |
|------|------|--------|
| 🔴 Must | 필수 (릴리스 필수) | 반드시 구현 |
| 🟡 Should | 권장 (중요하나 필수 아님) | 가능하면 구현 |
| 🟢 Could | 선택 (시간 허락시) | 여유시 구현 |
| ⚪ Won't | 제외 (이번 버전 제외) | 구현 안함 |

---

## 핵심 코딩 규칙 요약

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

## 작업 순서

| 작업 유형 | 순서 |
|----------|------|
| **Backend CRUD** | Entity → Repository → DTO → Exception → Service → Controller → Test |
| **Frontend 페이지** | Types → API Service → React Query Hook → Component → Test |

---

## 시작하기

### 1. AI에게 작업 요청

```
예: "User 엔티티와 CRUD API를 만들어줘"
```

### 2. AI가 계획 제시

```markdown
## 📋 작업 계획

### 작업 목록
| # | 작업 | 파일 |
|---|------|------|
| 1 | Entity 생성 | User.java |
| 2 | Repository 생성 | UserRepository.java |
| 3 | DTO 생성 | UserRequest.java, UserResponse.java |
...

이 계획대로 진행할까요?
```

### 3. 승인 후 진행

```
"ㅇㅇ" / "응" / "진행해"
```

---

## 문서 활용 가이드

| 상황 | 참조 문서 |
|------|----------|
| AI 작업 시작 전 | CLAUDE.md (핵심 진입점) |
| 특정 레이어 개발 | conventions/해당 번호 컨벤션 |
| 전체 구조 파악 | docs/context/architecture.md |
| DB 스키마 확인 | docs/context/database.md |
| API 명세 확인 | docs/context/api.md |
| 문제 해결 | docs/context/troubleshooting.md |

---

## 문서 특징

1. **계층적 구조**: CLAUDE.md 하나로 시작 → 필요시 상세 문서 참조
2. **선택적 로딩**: 작업별 필요한 컨벤션만 참조 (효율성)
3. **일관된 포맷**: 모든 문서가 동일한 구조와 스타일 유지
4. **실용적 예제**: 각 컨벤션에 실제 코드 예시 포함
5. **AI 최적화**: Claude Code가 이해하기 쉬운 형식으로 작성

---

## 참고 자료

- [맥도날드화 원칙 - 요즘IT](https://yozm.wishket.com/magazine/detail/3457/)
- [Claude Code 공식 문서](https://docs.anthropic.com/claude-code)

---

> 이 문서들을 기반으로 AI와 협업하여 일관되고 품질 높은 코드를 생산할 수 있습니다.
