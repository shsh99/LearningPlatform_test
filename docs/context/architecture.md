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
> **멀티테넌트 B2B SaaS 교육 플랫폼**
> 기업/기관이 자체 브랜딩된 학습 관리 시스템(LMS)을 구독형으로 사용하는 서비스

### 핵심 특징
- **멀티테넌시**: 단일 애플리케이션에서 다수 기업 지원
- **화이트라벨링**: 테넌트별 브랜딩 (로고, 색상, 용어)
- **역할 기반 접근 제어**: SUPER_ADMIN → TENANT_ADMIN → OPERATOR → USER

### 핵심 도메인
| 도메인 | 설명 | 주요 기능 |
|--------|------|----------|
| **Tenant** | 테넌트(기업) 관리 | 테넌트 CRUD, 브랜딩, 설정, 라벨 |
| **User** | 사용자 관리 | 회원가입, 로그인, 프로필, 역할 관리 |
| **Auth** | 인증/인가 | JWT 발급, 리프레시, 비밀번호 재설정 |
| **Course** | 강의 관리 | 강의 CRUD, 승인/거절 |
| **TimeSchedule** | 차수/일정 관리 | 차수 생성, 강사 배정, IIS |
| **Enrollment** | 수강 관리 | 수강 신청, 취소, SIS |
| **CourseApplication** | 강의 개설 신청 | 사용자의 강의 개설 요청 |
| **TenantApplication** | 테넌트 신청 | 기업의 서비스 가입 신청 |
| **Dashboard** | 대시보드 | 통계, 현황 조회 |

---

## 2. 역할 체계

### UserRole 계층
```
SUPER_ADMIN (슈퍼 관리자)
    │
    ├── 전체 시스템 관리
    ├── 테넌트 CRUD
    ├── 전체 통계 조회
    └── tenantId = NULL (테넌트 필터 미적용)

TENANT_ADMIN (테넌트 관리자)
    │
    ├── 자기 테넌트 관리
    ├── 브랜딩/설정/라벨 관리
    ├── OPERATOR 계정 관리
    └── 테넌트 통계 조회

OPERATOR (운영자)
    │
    ├── 강의/차수 관리
    ├── 강사 배정
    ├── 수강 관리
    └── IIS/SIS 조회

INSTRUCTOR (강사)
    │
    ├── 배정된 강의 조회
    └── 수강생 현황 조회

USER (일반 사용자 / 수강생)
    │
    ├── 강의 탐색
    ├── 수강 신청
    ├── 내 학습실
    └── 강의 개설 신청
```

### 역할별 데이터 접근
| 역할 | 데이터 범위 | 테넌트 필터 |
|------|------------|------------|
| SUPER_ADMIN | 전체 시스템 | 미적용 (tenantId=null) |
| TENANT_ADMIN | 자기 테넌트 | 적용 |
| OPERATOR | 자기 테넌트 | 적용 |
| INSTRUCTOR | 자기 테넌트 | 적용 |
| USER | 자기 테넌트 | 적용 |

---

## 3. 시스템 아키텍처

### 전체 흐름
```
[사용자] → [Frontend (React)]
              │
              │ /{tenantCode}/...
              │
              ▼
         [Backend (Spring Boot)]
              │
              ├── TenantFilter (테넌트 식별)
              ├── JwtAuthFilter (인증)
              ├── @PreAuthorize (권한)
              │
              ▼
         [Hibernate @Filter]
              │
              └── tenant_id 자동 적용
              │
              ▼
         [Database (MySQL/H2)]
              │
              └── 모든 테이블에 tenant_id
```

### 계층 구조 (Backend)
```
Controller (HTTP 요청/응답)
    │
    ├── @PreAuthorize 권한 체크
    ├── Request DTO 검증
    └── Response DTO 반환
    │
    ▼
Service (비즈니스 로직)
    │
    ├── @Transactional 관리
    ├── TenantContext 활용
    └── 비즈니스 규칙 적용
    │
    ▼
Repository (데이터 접근)
    │
    ├── JPA + Hibernate @Filter
    ├── findByIdAndTenantId (크로스테넌트 방지)
    └── 커스텀 쿼리
    │
    ▼
Entity (도메인 모델)
    │
    ├── TenantAware 인터페이스
    ├── @Filter 어노테이션
    └── 비즈니스 메서드
```

---

## 4. 모듈 구조

### Backend 모듈
```
backend/src/main/java/com/example/demo/
│
├── domain/
│   ├── tenant/                    # 테넌트 도메인
│   │   ├── controller/
│   │   │   ├── TenantController.java         # Admin API (SUPER_ADMIN)
│   │   │   ├── CurrentTenantController.java  # 현재 테넌트 API
│   │   │   └── PublicTenantController.java   # Public API
│   │   ├── entity/
│   │   │   ├── Tenant.java
│   │   │   ├── TenantBranding.java
│   │   │   ├── TenantSettings.java
│   │   │   ├── TenantLabels.java
│   │   │   └── TenantStatus.java
│   │   ├── dto/
│   │   ├── repository/
│   │   ├── service/
│   │   └── exception/
│   │
│   ├── user/                      # 사용자 도메인
│   │   ├── controller/
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── UserRole.java
│   │   │   └── UserStatus.java
│   │   ├── dto/
│   │   ├── repository/
│   │   ├── service/
│   │   └── exception/
│   │
│   ├── auth/                      # 인증 도메인
│   │   ├── controller/
│   │   ├── entity/
│   │   │   ├── RefreshToken.java
│   │   │   └── PasswordResetToken.java
│   │   ├── dto/
│   │   ├── repository/
│   │   └── service/
│   │
│   ├── course/                    # 강의 도메인
│   │   ├── controller/
│   │   ├── entity/
│   │   │   ├── Course.java
│   │   │   └── CourseStatus.java
│   │   ├── dto/
│   │   ├── repository/
│   │   ├── service/
│   │   └── exception/
│   │
│   ├── timeschedule/              # 차수/일정 도메인
│   │   ├── controller/
│   │   ├── entity/
│   │   │   ├── CourseTerm.java
│   │   │   ├── TermStatus.java
│   │   │   ├── InstructorAssignment.java
│   │   │   ├── AssignmentStatus.java
│   │   │   ├── InstructorInformationSystem.java
│   │   │   └── DayOfWeek.java
│   │   ├── dto/
│   │   ├── repository/
│   │   └── service/
│   │
│   ├── enrollment/                # 수강 도메인
│   │   ├── controller/
│   │   ├── entity/
│   │   │   ├── Enrollment.java
│   │   │   ├── EnrollmentStatus.java
│   │   │   └── StudentInformationSystem.java
│   │   ├── dto/
│   │   ├── repository/
│   │   └── service/
│   │
│   ├── courseapplication/         # 강의 개설 신청
│   │   ├── controller/
│   │   ├── entity/
│   │   │   ├── CourseApplication.java
│   │   │   └── ApplicationStatus.java
│   │   ├── dto/
│   │   ├── repository/
│   │   └── service/
│   │
│   ├── tenantapplication/         # 테넌트 가입 신청
│   │   ├── controller/
│   │   ├── entity/
│   │   │   ├── TenantApplication.java
│   │   │   └── ApplicationStatus.java
│   │   ├── dto/
│   │   ├── repository/
│   │   └── service/
│   │
│   └── dashboard/                 # 대시보드
│       ├── controller/
│       ├── dto/
│       └── service/
│           ├── DashboardService.java
│           ├── SuperAdminDashboardService.java
│           └── TenantAdminDashboardService.java
│
└── global/
    ├── config/                    # 설정
    │   ├── SecurityConfig.java
    │   ├── CorsConfig.java
    │   ├── JpaConfig.java
    │   └── DataInitializer.java
    │
    ├── exception/                 # 글로벌 예외 처리
    │   ├── GlobalExceptionHandler.java
    │   └── ErrorCode.java
    │
    ├── common/                    # 공통
    │   └── BaseTimeEntity.java
    │
    ├── security/                  # 보안
    │   ├── JwtTokenProvider.java
    │   ├── JwtAuthenticationFilter.java
    │   └── CustomUserDetails.java
    │
    ├── tenant/                    # 테넌트 인프라
    │   ├── package-info.java      # @FilterDef 정의
    │   ├── TenantAware.java       # 마커 인터페이스
    │   ├── TenantContext.java     # ThreadLocal
    │   ├── TenantFilter.java      # Servlet Filter
    │   └── TenantEntityListener.java
    │
    ├── email/                     # 이메일
    │   ├── EmailService.java
    │   └── ConsoleEmailService.java
    │
    └── file/                      # 파일
        └── FileStorageService.java
```

### Frontend 모듈
```
frontend/src/
│
├── pages/                         # 페이지 컴포넌트
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   │
│   ├── super-admin/               # SUPER_ADMIN 전용
│   │   ├── DashboardPage.tsx
│   │   ├── TenantsPage.tsx
│   │   ├── TenantDetailPage.tsx
│   │   ├── CreateTenantAdminPage.tsx
│   │   └── ApplicationsPage.tsx
│   │
│   ├── tenant-admin/              # TENANT_ADMIN 전용
│   │   ├── DashboardPage.tsx
│   │   ├── BrandingPage.tsx
│   │   └── OperatorsPage.tsx
│   │
│   ├── operator/                  # OPERATOR 전용
│   │   ├── DashboardPage.tsx
│   │   ├── TermsPage.tsx
│   │   ├── AssignmentsPage.tsx
│   │   └── IISPage.tsx
│   │
│   ├── user/                      # USER (수강생)
│   │   ├── CoursesPage.tsx
│   │   ├── CourseDetailPage.tsx
│   │   ├── MyLearningPage.tsx
│   │   ├── MyApplicationsPage.tsx
│   │   ├── ApplyCoursePage.tsx
│   │   └── MyProfilePage.tsx
│   │
│   └── common/
│       ├── HomePage.tsx
│       └── NotFoundPage.tsx
│
├── components/                    # 재사용 컴포넌트
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── Badge.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   │
│   └── charts/
│       ├── PieChart.tsx
│       └── BarChart.tsx
│
├── contexts/                      # React Context
│   ├── AuthContext.tsx
│   └── TenantContext.tsx
│
├── api/                           # API 호출
│   ├── axios.ts                   # Axios 인스턴스
│   ├── auth.ts
│   ├── tenant.ts
│   ├── user.ts
│   ├── course.ts
│   ├── enrollment.ts
│   └── dashboard.ts
│
├── hooks/                         # Custom Hooks
│   ├── useAuth.ts
│   ├── useTenant.ts
│   └── useApi.ts
│
├── types/                         # TypeScript 타입
│   ├── auth.ts
│   ├── tenant.ts
│   ├── user.ts
│   ├── course.ts
│   └── enrollment.ts
│
├── utils/                         # 유틸리티
│   ├── theme.ts
│   ├── storage.ts
│   └── validation.ts
│
└── routes/                        # 라우팅
    └── AppRoutes.tsx
```

---

## 5. 모듈 간 의존성

### 도메인 의존성 다이어그램
```
┌─────────────┐
│   Tenant    │ ←─────────────────────────────────────────┐
└──────┬──────┘                                           │
       │                                                  │
       │ 1:N                                              │
       ▼                                                  │
┌─────────────┐                                           │
│    User     │ ←─────────────────────────────────┐       │
└──────┬──────┘                                   │       │
       │                                          │       │
       │ 1:N                          1:N         │       │
       ▼                               │          │       │
┌─────────────┐      ┌─────────────┐   │          │       │
│   Course    │ ←────│ CourseTerm  │───┤          │       │
└─────────────┘  1:N └──────┬──────┘   │          │       │
                           │           │          │       │
               ┌───────────┼───────────┘          │       │
               │           │                      │       │
               ▼           ▼                      │       │
        ┌─────────────┐  ┌─────────────┐          │       │
        │ Enrollment  │  │ Instructor  │          │       │
        │             │  │ Assignment  │──────────┘       │
        └──────┬──────┘  └──────┬──────┘                  │
               │                │                         │
               ▼                ▼                         │
        ┌─────────────┐  ┌─────────────┐                  │
        │     SIS     │  │     IIS     │                  │
        └─────────────┘  └─────────────┘                  │
                                                          │
┌─────────────┐  ┌─────────────┐                          │
│   Course    │  │   Tenant    │                          │
│ Application │  │ Application │──────────────────────────┘
└─────────────┘  └─────────────┘
```

### 의존성 규칙
```
✅ 허용:
- Enrollment → User, CourseTerm (참조)
- CourseTerm → Course (참조)
- InstructorAssignment → User, CourseTerm (참조)
- Service → 다른 Service (필요시)
- 모든 도메인 → Tenant (테넌트 격리)

❌ 금지:
- Entity → Service (역방향 의존)
- Controller → Repository (직접 호출)
- 순환 의존 (A → B → A)
- 크로스 도메인 Entity 참조 (가급적 ID 참조)
```

---

## 6. 핵심 비즈니스 로직

### 테넌트 데이터 격리
```
1. 요청 진입 → TenantFilter
2. 테넌트 식별 (헤더/토큰/서브도메인)
3. TenantContext.setTenantId()
4. Hibernate @Filter 활성화
5. 모든 쿼리에 tenant_id 조건 자동 추가
6. SUPER_ADMIN은 필터 미적용

⚠️ 주의: findById()는 @Filter 미적용
   → findByIdAndTenantId() 사용 필수
```

### 수강 신청 프로세스
```
1. 사용자가 차수 선택
2. 수강 신청 가능 여부 확인
   - 이미 신청했는지?
   - 정원 초과인지?
   - 차수 상태가 SCHEDULED인지?
3. Enrollment 생성 (ENROLLED)
4. SIS 레코드 생성
5. CourseTerm.currentStudents 증가
```

### 인증 흐름
```
1. 로그인 → JWT Access Token + Refresh Token 발급
2. API 요청 시 Access Token 검증
3. 만료 시 Refresh Token으로 재발급
4. Refresh Token도 만료 시 재로그인
5. 로그아웃 시 Refresh Token 삭제
```

### 강의 승인 프로세스
```
[USER] 강의 개설 신청 (CourseApplication)
         │
         ▼
[OPERATOR] 신청 검토
         │
    ┌────┴────┐
    ▼         ▼
 승인       거절
    │         │
    ▼         └→ reject_reason 기록
 Course 생성
 (APPROVED)
```

---

## 7. 기술 스택별 역할

| 기술 | 역할 | 위치 |
|------|------|------|
| Spring Security | 인증/인가, JWT | global/security/ |
| JPA/Hibernate | ORM, @Filter | domain/*/repository/ |
| TenantContext | 테넌트 격리 | global/tenant/ |
| React Context | 테넌트/인증 상태 | Frontend contexts/ |
| React Router | 테넌트별 라우팅 | Frontend routes/ |
| Axios | HTTP 클라이언트 | Frontend api/ |
| TailwindCSS | 동적 테마 (CSS Variables) | Frontend |

---

## 8. Phase 2-3 확장 포인트

### Phase 2: 통계 & 모니터링
```
domain/
├── audit/                         # 감사 로그
│   ├── entity/AuditLog.java
│   └── service/AuditService.java
│
├── statistics/                    # 사용량 통계
│   ├── entity/UsageStatistics.java
│   └── service/UsageStatisticsService.java
│
└── announcement/                  # 공지사항
    ├── entity/Announcement.java
    └── service/AnnouncementService.java
```

### Phase 3: 커스터마이징
```
domain/tenant/entity/
├── TenantLayoutSettings.java      # 레이아웃 설정
├── TenantSecuritySettings.java    # 보안 정책
└── TenantEmailTemplate.java       # 이메일 템플릿

domain/user/entity/
└── OperatorPermission.java        # 권한 세분화
```

---

## 9. 새 도메인 추가 시 체크리스트

```
□ domain/{도메인명}/ 폴더 생성
□ Entity 생성 (TenantAware 구현, @Filter 추가)
□ Repository 생성 (findByIdAndTenantId 추가)
□ Service 생성 (@Transactional)
□ Controller 생성 (@PreAuthorize)
□ DTO 생성 (Record, from() 팩토리)
□ Exception 생성 (ErrorCode 등록)
□ 이 문서에 모듈 관계 업데이트
□ database.md 테이블 스키마 추가
□ api.md 엔드포인트 추가
```

---

## 관련 문서

- [feature-roadmap.md](./feature-roadmap.md) - 기능 로드맵
- [database.md](./database.md) - 상세 DB 스키마
- [api.md](./api.md) - API 명세
- [multi-tenancy.md](./multi-tenancy.md) - 멀티테넌시 구현
- [pages.md](./pages.md) - 프론트엔드 페이지

---

> **이 문서를 업데이트해야 할 때:**
> - 새 도메인/모듈 추가 시
> - 모듈 간 의존성 변경 시
> - 핵심 비즈니스 로직 변경 시
> - 역할/권한 체계 변경 시
