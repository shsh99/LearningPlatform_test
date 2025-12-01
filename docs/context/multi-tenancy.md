# Multi-Tenancy Architecture

> LearningPlatform의 멀티테넌시 구현 가이드

## 개요

LearningPlatform은 **Single Database, Shared Schema** 방식의 멀티테넌시를 구현합니다.
각 테넌트(기업/조직)는 동일한 애플리케이션과 데이터베이스를 공유하면서도 데이터 격리와 커스터마이징이 보장됩니다.

## 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ TenantContext│  │ URL Routing  │  │ CSS Variables│          │
│  │ (브랜딩/설정) │  │ /{tenantCode}│  │ (동적 테마)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Spring Boot)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ TenantFilter │  │TenantContext │  │ @Filter      │          │
│  │ (요청 처리)   │  │ (ThreadLocal)│  │ (Hibernate)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database (MySQL/H2)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  모든 테이블에 tenant_id 컬럼 (데이터 격리)              │   │
│  │  tenants, tenant_branding, tenant_settings, tenant_labels│   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 역할 체계 (UserRole)

| 역할 | 설명 | 테넌트 범위 |
|------|------|------------|
| `SUPER_ADMIN` | 전체 시스템 관리자 | 전체 (필터 미적용) |
| `TENANT_ADMIN` | 테넌트 관리자 | 자신의 테넌트만 |
| `OPERATOR` | 운영자 | 자신의 테넌트만 |
| `INSTRUCTOR` | 강사 | 자신의 테넌트만 |
| `USER` | 일반 사용자 (수강생) | 자신의 테넌트만 |

## Backend 구현

### 1. 핵심 컴포넌트

#### TenantContext (ThreadLocal)
```java
// 현재 요청의 테넌트 ID를 ThreadLocal에 저장
public class TenantContext {
    private static final ThreadLocal<Long> currentTenantId = new ThreadLocal<>();

    public static void setTenantId(Long tenantId) { ... }
    public static Long getTenantId() { ... }
    public static void clear() { ... }
}
```

#### TenantAware (마커 인터페이스)
```java
// 테넌트 격리가 필요한 엔티티에 구현
public interface TenantAware {
    Long getTenantId();
}
```

#### TenantFilter (Servlet Filter)
```java
// 요청마다 테넌트 식별 및 Hibernate 필터 활성화
@Component
@Order(1)
public class TenantFilter extends OncePerRequestFilter {
    // 테넌트 식별 우선순위:
    // 1. X-Tenant-ID 헤더
    // 2. 서브도메인 (samsung.learning.com → samsung)
    // 3. 기본 테넌트 (개발 환경)
}
```

### 2. Entity 설정

테넌트 격리가 필요한 엔티티는 다음과 같이 설정:

```java
@Entity
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class User extends BaseTimeEntity implements TenantAware {

    @Column(name = "tenant_id")
    private Long tenantId;

    @Override
    public Long getTenantId() {
        return tenantId;
    }
}
```

#### @FilterDef 정의 (package-info.java)
```java
// global/tenant/package-info.java
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = Long.class))
package com.example.demo.global.tenant;
```

> **중요**: `@FilterDef`는 **한 번만** 정의해야 합니다. 여러 엔티티에 중복 정의하면 에러 발생.

### 3. 테넌트 격리 적용 엔티티

| 엔티티 | 설명 |
|--------|------|
| `User` | 사용자 |
| `RefreshToken` | 리프레시 토큰 |
| `PasswordResetToken` | 비밀번호 재설정 토큰 |
| `InstructorAssignment` | 강사 배정 |
| `Course` | 강의 |
| `CourseTerm` | 강의 기수 |
| `Enrollment` | 수강 신청 |
| `CourseApplication` | 수강 신청서 |

### 4. SUPER_ADMIN 예외 처리

```java
// TenantFilter.java
private boolean isSuperAdmin() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
}

// SUPER_ADMIN은 Hibernate 필터를 활성화하지 않음 → 모든 테넌트 데이터 접근 가능
```

## Frontend 구현

### 1. URL 기반 라우팅

```
/{tenantCode}/login          # 테넌트별 로그인
/{tenantCode}/signup         # 테넌트별 회원가입
/{tenantCode}/dashboard      # 테넌트별 대시보드
/{tenantCode}/courses        # 테넌트별 강의 목록
```

### 2. TenantContext (React Context)

```tsx
interface TenantContextValue {
    tenantCode: string | null;
    branding: TenantBranding;
    settings: TenantSettings | null;
    labels: TenantLabels;
    isLoading: boolean;
    buildPath: (path: string) => string;
    navigate: (path: string) => void;
}

// 사용 예시
const { branding, labels, buildPath } = useTenant();
```

### 3. 동적 테마 적용 (CSS Variables)

```tsx
const applyCssVariables = (branding: TenantBranding) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', branding.primaryColor);
    root.style.setProperty('--header-bg', branding.headerBgColor);
    // ... 기타 CSS 변수
};
```

### 4. 커스텀 Hooks

| Hook | 용도 |
|------|------|
| `useTenant()` | 전체 테넌트 정보 |
| `useBranding()` | 브랜딩 정보만 |
| `useSettings()` | 설정 정보만 |
| `useLabels()` | 라벨 정보만 |
| `useLabel(key)` | 특정 라벨 |
| `useFeatureEnabled(feature)` | 기능 활성화 여부 |
| `useTenantNavigation()` | 테넌트 경로 네비게이션 |

## 테넌트 관련 테이블

### tenants
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT | PK |
| code | VARCHAR(50) | 고유 코드 (samsung, kakao) |
| name | VARCHAR(100) | 테넌트명 |
| domain | VARCHAR(255) | 도메인 (옵션) |
| status | ENUM | ACTIVE, INACTIVE, SUSPENDED, DELETED |

### tenant_branding
| 컬럼 | 설명 |
|------|------|
| primary_color | 기본 색상 |
| header_bg_color | 헤더 배경색 |
| logo_url | 로고 URL |
| favicon_url | 파비콘 URL |
| font_family | 폰트 |
| custom_css | 커스텀 CSS |

### tenant_settings
| 컬럼 | 설명 |
|------|------|
| course_enabled | 강의 기능 활성화 |
| enrollment_enabled | 수강신청 활성화 |
| max_users_limit | 최대 사용자 수 |
| max_courses_limit | 최대 강의 수 |
| session_timeout_minutes | 세션 타임아웃 |

### tenant_labels
| 컬럼 | 기본값 | 커스텀 예시 |
|------|--------|------------|
| course_label | 강의 | 과정 |
| term_label | 차수 | 기수 |
| student_label | 수강생 | 교육생 |
| instructor_label | 강사 | 튜터 |
| platform_name | Learning Platform | OO 아카데미 |

## API 엔드포인트

### Public API (인증 불필요)
```
GET /api/public/tenants/{code}/exists     # 테넌트 존재 확인
GET /api/public/tenants/{code}/branding   # 브랜딩 조회
GET /api/public/tenants/{code}/labels     # 라벨 조회
```

### Current Tenant API (로그인 필요)
```
GET /api/tenant/current                   # 현재 테넌트 정보
GET /api/tenant/current/branding          # 현재 테넌트 브랜딩
GET /api/tenant/current/settings          # 현재 테넌트 설정
GET /api/tenant/current/labels            # 현재 테넌트 라벨
```

### Admin API (SUPER_ADMIN 전용)
```
GET    /api/admin/tenants                 # 전체 테넌트 목록
POST   /api/admin/tenants                 # 테넌트 생성
GET    /api/admin/tenants/{id}            # 테넌트 상세
PUT    /api/admin/tenants/{id}            # 테넌트 수정
DELETE /api/admin/tenants/{id}            # 테넌트 삭제
PUT    /api/admin/tenants/{id}/branding   # 브랜딩 수정
PUT    /api/admin/tenants/{id}/settings   # 설정 수정
PUT    /api/admin/tenants/{id}/labels     # 라벨 수정
```

## 회원가입 플로우

```
1. 사용자가 /{tenantCode}/signup 접속
2. 회사 코드 입력 (예: "SAMSUNG-2024")
3. 백엔드에서 회사 코드로 테넌트 조회
4. 사용자 생성 시 tenant_id 자동 설정
5. 로그인 시 테넌트별 대시보드로 리다이렉트
```

## 주의사항

### 1. @FilterDef 중복 금지
```java
// ❌ 잘못된 예: 각 엔티티에 @FilterDef 정의
@FilterDef(name = "tenantFilter", ...)
@Entity
public class User { }

// ✅ 올바른 예: package-info.java에 한 번만 정의
// package-info.java
@FilterDef(name = "tenantFilter", ...)
package com.example.demo.global.tenant;
```

### 2. JPQL Enum 비교
```java
// ❌ 잘못된 예: 문자열 비교
@Query("SELECT u FROM User u WHERE u.status = 'ACTIVE'")

// ✅ 올바른 예: 정규화된 enum 경로
@Query("SELECT u FROM User u WHERE u.status = com.example.demo.domain.user.entity.UserStatus.ACTIVE")
```

### 3. SUPER_ADMIN 데이터 접근
- SUPER_ADMIN은 Hibernate 필터가 적용되지 않음
- 모든 테넌트의 데이터에 접근 가능
- 관리 페이지에서 테넌트 선택/필터링 UI 필요

## 파일 구조

```
backend/src/main/java/com/example/demo/
├── domain/tenant/
│   ├── controller/
│   │   ├── TenantController.java        # Admin API
│   │   ├── CurrentTenantController.java # 현재 테넌트 API
│   │   └── PublicTenantController.java  # Public API
│   ├── entity/
│   │   ├── Tenant.java
│   │   ├── TenantBranding.java
│   │   ├── TenantSettings.java
│   │   └── TenantLabels.java
│   ├── dto/
│   ├── repository/
│   ├── service/
│   └── exception/
└── global/tenant/
    ├── package-info.java     # @FilterDef 정의
    ├── TenantAware.java      # 마커 인터페이스
    ├── TenantContext.java    # ThreadLocal
    ├── TenantFilter.java     # Servlet Filter
    └── TenantEntityListener.java

frontend/src/
├── contexts/
│   └── TenantContext.tsx     # React Context
├── types/
│   └── tenant.ts             # 타입 정의
├── api/
│   └── tenant.ts             # API 호출
└── utils/
    └── tenantUrl.ts          # URL 유틸리티
```
