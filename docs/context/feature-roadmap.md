# Feature Roadmap - B2B SaaS LMS

> 멀티테넌트 B2B SaaS 학습 플랫폼 기능 로드맵
> Phase 1-3까지 구현 범위 정의

---

## Phase 개요

| Phase | 목표 | 상태 |
|-------|------|------|
| **Phase 1** | 핵심 기능 (MVP) | ✅ 완료 |
| **Phase 2** | 통계 & 모니터링 | 🔄 진행 예정 |
| **Phase 3** | 고급 커스터마이징 | 📋 계획 |

---

## Phase 1: 핵심 기능 (MVP) ✅

### SUPER_ADMIN
| 기능 | 설명 | 상태 |
|------|------|:----:|
| 테넌트 CRUD | 생성, 조회, 수정, 삭제 | ✅ |
| 테넌트 활성화/비활성화 | 상태 변경 | ✅ |
| 테넌트 브랜딩 관리 | 색상, 로고 설정 | ✅ |
| 테넌트 설정 관리 | 기능 on/off 플래그 | ✅ |
| 테넌트 라벨 관리 | 용어 커스터마이징 | ✅ |
| TENANT_ADMIN 계정 생성 | 테넌트별 관리자 생성 | ✅ |

### TENANT_ADMIN
| 기능 | 설명 | 상태 |
|------|------|:----:|
| 브랜딩 설정 | 로고, 색상, 헤더/사이드바 | ✅ |
| 라벨 설정 | 강의→과정, 수강생→교육생 등 | ✅ |
| OPERATOR 계정 관리 | 생성, 수정, 삭제 | ✅ |
| 기본 대시보드 | 테넌트 정보 표시 | ✅ |

### OPERATOR
| 기능 | 설명 | 상태 |
|------|------|:----:|
| 강의 관리 | CRUD, 승인/거절 | ✅ |
| 차수(Term) 관리 | 생성, 일정 설정 | ✅ |
| 강사 배정 | 차수별 강사 배정 | ✅ |
| 수강 관리 | 수강 신청 처리 | ✅ |
| IIS/SIS 조회 | 강사/수강생 정보 시스템 | ✅ |

### USER (수강생)
| 기능 | 설명 | 상태 |
|------|------|:----:|
| 회원가입/로그인 | 테넌트별 인증 | ✅ |
| 강의 탐색 | 목록 조회, 검색 | ✅ |
| 수강 신청 | 차수별 신청 | ✅ |
| 내 학습실 | 수강 현황 조회 | ✅ |
| 강의 개설 신청 | 신규 강의 요청 | ✅ |

### 인프라 & 보안
| 기능 | 설명 | 상태 |
|------|------|:----:|
| 멀티테넌트 데이터 격리 | Hibernate @Filter | ✅ |
| JWT 인증 | Access + Refresh Token | ✅ |
| 역할 기반 권한 | @PreAuthorize | ✅ |
| 크로스테넌트 방지 | ID 조회 시 tenantId 검증 | ✅ |

---

## Phase 2: 통계 & 모니터링 🔄

### SUPER_ADMIN 통계 대시보드

#### 전체 시스템 통계
| 기능 | 설명 | API |
|------|------|-----|
| 전체 테넌트 수 | 활성/비활성 구분 | `GET /api/super-admin/stats/tenants` |
| 전체 사용자 수 | 역할별 분포 | `GET /api/super-admin/stats/users` |
| 전체 강의 수 | 상태별 분포 | `GET /api/super-admin/stats/courses` |
| 전체 수강 현황 | 진행중/완료 | `GET /api/super-admin/stats/enrollments` |

#### 테넌트별 통계
| 기능 | 설명 | API |
|------|------|-----|
| 테넌트별 사용자 수 | 테넌트별 유저 카운트 | `GET /api/super-admin/stats/tenants/{id}/users` |
| 테넌트별 강의 수 | 테넌트별 강의 카운트 | `GET /api/super-admin/stats/tenants/{id}/courses` |
| 테넌트별 활동량 | 로그인 횟수, API 호출 | `GET /api/super-admin/stats/tenants/{id}/activity` |
| 테넌트별 스토리지 | 파일 업로드 용량 | `GET /api/super-admin/stats/tenants/{id}/storage` |

#### 테넌트 관리 고도화
| 기능 | 설명 | API |
|------|------|-----|
| 테넌트 신청 승인 플로우 | 신청→검토→승인/거절 | `PUT /api/super-admin/tenant-applications/{id}/approve` |
| 테넌트 일괄 작업 | 다중 선택 상태 변경 | `PUT /api/super-admin/tenants/bulk-status` |
| 글로벌 공지사항 | 전체 테넌트 공지 | `POST /api/super-admin/announcements` |

### TENANT_ADMIN 통계 대시보드

#### 테넌트 내 통계
| 기능 | 설명 | API |
|------|------|-----|
| 사용자 통계 | 총 사용자, 역할별 분포 | `GET /api/tenant-admin/stats/users` |
| 강의 통계 | 총 강의, 상태별 분포 | `GET /api/tenant-admin/stats/courses` |
| 수강 통계 | 수강 신청/완료 현황 | `GET /api/tenant-admin/stats/enrollments` |
| 활동 통계 | 일별/주별 활동량 | `GET /api/tenant-admin/stats/activity` |

#### 차트 & 시각화
| 차트 | 데이터 | 타입 |
|------|--------|------|
| 사용자 증가 추이 | 일별/월별 신규 가입 | Line Chart |
| 역할별 분포 | USER/INSTRUCTOR/OPERATOR | Pie Chart |
| 강의 상태 현황 | DRAFT/APPROVED/REJECTED | Bar Chart |
| 수강 완료율 | 완료/진행중/미시작 | Donut Chart |

### 감사 로그 (Audit Log)

#### 추적 대상
| 액션 | 대상 | 기록 정보 |
|------|------|----------|
| CREATE | 사용자, 강의, 테넌트 | who, when, what |
| UPDATE | 설정, 브랜딩, 권한 | before, after |
| DELETE | 사용자, 강의 | soft delete 포함 |
| LOGIN | 인증 | IP, User-Agent |
| PERMISSION | 권한 변경 | 역할 변경 이력 |

#### 테이블 구조
```sql
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT,                    -- NULL이면 시스템 레벨
    user_id BIGINT NOT NULL,             -- 수행한 사용자
    action VARCHAR(50) NOT NULL,         -- CREATE, UPDATE, DELETE, LOGIN
    entity_type VARCHAR(100) NOT NULL,   -- User, Course, Tenant 등
    entity_id BIGINT,                    -- 대상 엔티티 ID
    old_value JSON,                      -- 변경 전 값
    new_value JSON,                      -- 변경 후 값
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    created_at TIMESTAMP NOT NULL
);
```

### 사용량 추적

#### 테이블 구조
```sql
CREATE TABLE usage_statistics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT NOT NULL,
    stat_date DATE NOT NULL,             -- 집계 날짜
    active_users INT DEFAULT 0,          -- 활성 사용자 수
    login_count INT DEFAULT 0,           -- 로그인 횟수
    api_calls INT DEFAULT 0,             -- API 호출 수
    storage_used_mb DECIMAL(10,2),       -- 스토리지 사용량
    course_views INT DEFAULT 0,          -- 강의 조회 수
    enrollments INT DEFAULT 0,           -- 수강 신청 수
    created_at TIMESTAMP NOT NULL,
    UNIQUE KEY uk_tenant_date (tenant_id, stat_date)
);
```

---

## Phase 3: 고급 커스터마이징 📋

### TENANT_ADMIN 브랜딩 확장

#### 테마 시스템
| 기능 | 설명 |
|------|------|
| 테마 템플릿 | 미리 정의된 테마 선택 (Light, Dark, Corporate 등) |
| 커스텀 테마 저장 | 현재 설정을 템플릿으로 저장 |
| 테마 프리뷰 | 적용 전 미리보기 |
| 테마 초기화 | 기본값으로 복원 |

#### 폰트 커스터마이징
| 기능 | 설명 |
|------|------|
| 시스템 폰트 선택 | Pretendard, Noto Sans KR, Roboto 등 |
| 커스텀 폰트 URL | Google Fonts, 자체 호스팅 |
| 폰트 크기 조절 | 기본 폰트 사이즈 설정 |

#### 고급 색상 설정
| 항목 | 설명 |
|------|------|
| Primary/Secondary/Accent | 기본 컬러 팔레트 |
| Header 배경/텍스트 | 상단 네비게이션 |
| Sidebar 배경/텍스트/Active | 사이드 메뉴 |
| Button Primary/Secondary | 버튼 스타일 |
| 배경색 | 페이지 배경 |
| 커스텀 CSS | 고급 사용자용 직접 CSS 입력 |

### 레이아웃 커스터마이징

#### 컴포넌트 On/Off
| 컴포넌트 | 설명 | 기본값 |
|----------|------|--------|
| Header 검색바 | 상단 검색 기능 | ON |
| Sidebar | 좌측 메뉴 | ON |
| Footer | 하단 푸터 | ON |
| 배너 섹션 | 메인 배너 영역 | ON |
| 공지사항 팝업 | 로그인 후 팝업 | OFF |
| 광고 영역 | 프로모션 배너 | OFF |

#### 메뉴 구성
| 기능 | 설명 |
|------|------|
| 메뉴 항목 순서 변경 | 드래그 앤 드롭 |
| 메뉴 항목 숨기기 | 불필요한 메뉴 비활성화 |
| 커스텀 메뉴 추가 | 외부 링크 메뉴 추가 |
| 메뉴 아이콘 변경 | 아이콘 선택 |

#### 테이블 구조 (확장)
```sql
-- tenant_layout_settings 테이블
CREATE TABLE tenant_layout_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT NOT NULL UNIQUE,

    -- 컴포넌트 On/Off
    header_search_enabled BOOLEAN DEFAULT TRUE,
    sidebar_enabled BOOLEAN DEFAULT TRUE,
    footer_enabled BOOLEAN DEFAULT TRUE,
    banner_enabled BOOLEAN DEFAULT TRUE,
    announcement_popup_enabled BOOLEAN DEFAULT FALSE,
    ad_section_enabled BOOLEAN DEFAULT FALSE,

    -- 메뉴 설정 (JSON)
    menu_config JSON,                    -- 순서, 표시 여부, 커스텀 메뉴

    -- 테마 설정
    theme_template VARCHAR(50),          -- light, dark, corporate, custom
    saved_themes JSON,                   -- 저장된 커스텀 테마 목록

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### 네이밍 & 라벨 확장

#### 확장된 라벨 설정
| 기존 라벨 | 추가 라벨 |
|----------|----------|
| courseLabel (강의) | navbarTitle (상단 메뉴) |
| termLabel (차수) | sidebarTitle (사이드 메뉴) |
| studentLabel (수강생) | dashboardTitle (대시보드) |
| instructorLabel (강사) | profileLabel (프로필) |
| platformName (플랫폼명) | welcomeMessage (환영 메시지) |

#### 테이블 확장
```sql
ALTER TABLE tenant_labels ADD COLUMN navbar_title VARCHAR(50) DEFAULT '메뉴';
ALTER TABLE tenant_labels ADD COLUMN sidebar_title VARCHAR(50) DEFAULT '탐색';
ALTER TABLE tenant_labels ADD COLUMN welcome_message VARCHAR(200) DEFAULT '환영합니다';
ALTER TABLE tenant_labels ADD COLUMN footer_text VARCHAR(500);
```

### 사용자 관리 고도화

#### CSV 일괄 등록
| 기능 | 설명 | API |
|------|------|-----|
| CSV 템플릿 다운로드 | 샘플 파일 제공 | `GET /api/tenant-admin/users/csv-template` |
| CSV 업로드 & 검증 | 데이터 유효성 검사 | `POST /api/tenant-admin/users/csv-validate` |
| 일괄 생성 실행 | 검증 후 생성 | `POST /api/tenant-admin/users/csv-import` |
| 결과 리포트 | 성공/실패 건수 | 응답에 포함 |

#### CSV 형식
```csv
email,name,role,department
user1@company.com,홍길동,USER,개발팀
user2@company.com,김철수,INSTRUCTOR,교육팀
```

#### 데이터 내보내기
| 대상 | 형식 | API |
|------|------|-----|
| 사용자 목록 | Excel/CSV | `GET /api/tenant-admin/users/export` |
| 강의 목록 | Excel/CSV | `GET /api/tenant-admin/courses/export` |
| 수강 현황 | Excel/CSV | `GET /api/tenant-admin/enrollments/export` |
| 통계 리포트 | PDF/Excel | `GET /api/tenant-admin/reports/export` |

### 역할 & 권한 세분화

#### OPERATOR 권한 세분화
| 권한 | 설명 | 기본값 |
|------|------|--------|
| COURSE_READ | 강의 조회 | ✅ |
| COURSE_WRITE | 강의 생성/수정 | ✅ |
| COURSE_DELETE | 강의 삭제 | ❌ |
| COURSE_APPROVE | 강의 승인/거절 | ✅ |
| USER_READ | 사용자 조회 | ✅ |
| USER_WRITE | 사용자 수정 | ❌ |
| ENROLLMENT_MANAGE | 수강 관리 | ✅ |
| TERM_MANAGE | 차수 관리 | ✅ |
| INSTRUCTOR_ASSIGN | 강사 배정 | ✅ |
| REPORT_VIEW | 리포트 조회 | ✅ |

#### 테이블 구조
```sql
CREATE TABLE operator_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,             -- OPERATOR 사용자
    tenant_id BIGINT NOT NULL,
    permission VARCHAR(50) NOT NULL,     -- 권한 코드
    granted BOOLEAN DEFAULT TRUE,
    granted_by BIGINT,                   -- 권한 부여자
    granted_at TIMESTAMP,
    UNIQUE KEY uk_user_permission (user_id, permission)
);
```

### 알림 & 이메일 설정

#### 알림 채널 설정
| 채널 | 설명 | 설정 |
|------|------|------|
| 이메일 | 주요 알림 이메일 발송 | ON/OFF |
| 인앱 알림 | 시스템 내 알림 | ON/OFF |
| SMS (확장) | 문자 알림 | ON/OFF |

#### 이메일 템플릿 커스터마이징
| 템플릿 | 용도 |
|--------|------|
| welcome | 회원가입 환영 |
| password_reset | 비밀번호 재설정 |
| enrollment_approved | 수강 승인 |
| enrollment_rejected | 수강 거절 |
| course_reminder | 강의 시작 알림 |

#### 테이블 구조
```sql
CREATE TABLE tenant_email_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT NOT NULL,
    template_type VARCHAR(50) NOT NULL,  -- welcome, password_reset 등
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,                  -- HTML 템플릿
    variables JSON,                      -- 사용 가능한 변수 목록
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE KEY uk_tenant_template (tenant_id, template_type)
);
```

### 로그인 & 보안 정책

#### 테넌트별 보안 설정
| 설정 | 설명 | 기본값 |
|------|------|--------|
| 비밀번호 최소 길이 | 최소 문자 수 | 8 |
| 비밀번호 복잡성 | 대소문자/숫자/특수문자 요구 | 중간 |
| 세션 타임아웃 | 자동 로그아웃 시간 (분) | 30 |
| 로그인 시도 제한 | 실패 횟수 제한 | 5회 |
| 계정 잠금 시간 | 잠금 후 대기 시간 (분) | 30 |
| 2FA 활성화 | 2단계 인증 | OFF |
| IP 화이트리스트 | 허용 IP 목록 | 비활성 |

#### 테이블 구조
```sql
CREATE TABLE tenant_security_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT NOT NULL UNIQUE,

    -- 비밀번호 정책
    password_min_length INT DEFAULT 8,
    password_require_uppercase BOOLEAN DEFAULT TRUE,
    password_require_lowercase BOOLEAN DEFAULT TRUE,
    password_require_number BOOLEAN DEFAULT TRUE,
    password_require_special BOOLEAN DEFAULT FALSE,
    password_expiry_days INT DEFAULT 0,  -- 0 = 만료 없음

    -- 세션 정책
    session_timeout_minutes INT DEFAULT 30,
    max_concurrent_sessions INT DEFAULT 3,

    -- 로그인 보안
    max_login_attempts INT DEFAULT 5,
    lockout_duration_minutes INT DEFAULT 30,

    -- 고급 보안
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    ip_whitelist_enabled BOOLEAN DEFAULT FALSE,
    ip_whitelist JSON,                   -- 허용 IP 목록

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

---

## API 엔드포인트 요약

### Phase 2 신규 API

```
# SUPER_ADMIN 통계
GET  /api/super-admin/stats/overview          # 전체 시스템 통계
GET  /api/super-admin/stats/tenants           # 테넌트 목록 + 통계
GET  /api/super-admin/stats/tenants/{id}      # 특정 테넌트 상세 통계
GET  /api/super-admin/audit-logs              # 감사 로그 조회

# SUPER_ADMIN 관리
POST /api/super-admin/announcements           # 글로벌 공지
PUT  /api/super-admin/tenants/bulk-status     # 테넌트 일괄 상태 변경

# TENANT_ADMIN 통계
GET  /api/tenant-admin/stats/overview         # 테넌트 통계 개요
GET  /api/tenant-admin/stats/users            # 사용자 통계
GET  /api/tenant-admin/stats/courses          # 강의 통계
GET  /api/tenant-admin/stats/activity         # 활동 통계 (일별/주별)
GET  /api/tenant-admin/audit-logs             # 테넌트 내 감사 로그
```

### Phase 3 신규 API

```
# 브랜딩 확장
GET  /api/tenant-admin/themes/templates       # 테마 템플릿 목록
POST /api/tenant-admin/themes/save            # 커스텀 테마 저장
GET  /api/tenant-admin/themes/preview         # 테마 프리뷰

# 레이아웃
GET  /api/tenant-admin/layout                 # 레이아웃 설정 조회
PUT  /api/tenant-admin/layout                 # 레이아웃 설정 수정
PUT  /api/tenant-admin/layout/menu            # 메뉴 구성 수정

# 사용자 관리
GET  /api/tenant-admin/users/csv-template     # CSV 템플릿 다운로드
POST /api/tenant-admin/users/csv-validate     # CSV 검증
POST /api/tenant-admin/users/csv-import       # CSV 일괄 등록
GET  /api/tenant-admin/users/export           # 사용자 목록 내보내기

# 권한 관리
GET  /api/tenant-admin/operators/{id}/permissions    # 권한 조회
PUT  /api/tenant-admin/operators/{id}/permissions    # 권한 수정

# 알림 & 이메일
GET  /api/tenant-admin/notification-settings  # 알림 설정 조회
PUT  /api/tenant-admin/notification-settings  # 알림 설정 수정
GET  /api/tenant-admin/email-templates        # 이메일 템플릿 목록
PUT  /api/tenant-admin/email-templates/{type} # 템플릿 수정

# 보안 정책
GET  /api/tenant-admin/security-settings      # 보안 설정 조회
PUT  /api/tenant-admin/security-settings      # 보안 설정 수정

# 내보내기
GET  /api/tenant-admin/courses/export         # 강의 목록 내보내기
GET  /api/tenant-admin/enrollments/export     # 수강 현황 내보내기
GET  /api/tenant-admin/reports/export         # 리포트 내보내기
```

---

## 프론트엔드 페이지 요약

### Phase 2 신규 페이지

```
# SUPER_ADMIN
/super-admin/dashboard              # 통계 대시보드 (차트 포함)
/super-admin/tenants/:id/stats      # 테넌트별 상세 통계
/super-admin/audit-logs             # 감사 로그 조회
/super-admin/announcements          # 글로벌 공지 관리

# TENANT_ADMIN
/{tenantCode}/tenant-admin/dashboard       # 통계 대시보드
/{tenantCode}/tenant-admin/audit-logs      # 감사 로그
```

### Phase 3 신규 페이지

```
# TENANT_ADMIN
/{tenantCode}/tenant-admin/branding/themes     # 테마 관리
/{tenantCode}/tenant-admin/layout              # 레이아웃 설정
/{tenantCode}/tenant-admin/users/import        # 사용자 일괄 등록
/{tenantCode}/tenant-admin/users/export        # 데이터 내보내기
/{tenantCode}/tenant-admin/operators/:id/permissions  # 권한 관리
/{tenantCode}/tenant-admin/notifications       # 알림 설정
/{tenantCode}/tenant-admin/email-templates     # 이메일 템플릿
/{tenantCode}/tenant-admin/security            # 보안 정책
```

---

## 구현 우선순위

### Phase 2 (권장 순서)
1. **SUPER_ADMIN 통계 대시보드** - 시스템 전체 현황 파악
2. **TENANT_ADMIN 통계 대시보드** - 테넌트 관리자 필수 기능
3. **감사 로그** - 보안 및 추적성
4. **사용량 추적** - 향후 과금/제한 기반

### Phase 3 (권장 순서)
1. **CSV 일괄 등록** - 대량 사용자 온보딩
2. **데이터 내보내기** - 리포팅 필수
3. **OPERATOR 권한 세분화** - 세밀한 접근 제어
4. **레이아웃 커스터마이징** - 차별화 기능
5. **테마 시스템** - UX 향상
6. **보안 정책** - 엔터프라이즈 요구사항
7. **이메일 템플릿** - 브랜딩 완성

---

## 관련 문서

- [architecture.md](./architecture.md) - 시스템 아키텍처
- [database.md](./database.md) - 데이터베이스 스키마
- [api.md](./api.md) - API 명세
- [multi-tenancy.md](./multi-tenancy.md) - 멀티테넌시 구현
- [pages.md](./pages.md) - 프론트엔드 페이지
