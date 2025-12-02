# Pages Context

> AI가 프론트엔드 페이지 작업 시 참조하는 상세 명세
> **멀티테넌트 B2B SaaS** 환경 기준

---

## 목차

1. [URL 구조](#url-구조)
2. [역할별 페이지 접근권한](#역할별-페이지-접근권한)
3. [Phase 1: Core 페이지](#phase-1-core-페이지)
4. [Phase 2: 통계/모니터링 페이지](#phase-2-통계모니터링-페이지)
5. [Phase 3: 고급 설정 페이지](#phase-3-고급-설정-페이지)
6. [공통 컴포넌트](#공통-컴포넌트)
7. [라우트 가드](#라우트-가드)

---

## URL 구조

### 테넌트별 서브도메인
```
https://{subdomain}.lms.example.com/...
https://techcorp.lms.example.com/login
https://edustart.lms.example.com/dashboard
```

### 전체 라우트 구조 (Phase 1-3)
```
# 공개 페이지
/login                          → 로그인 (테넌트 브랜딩 적용)
/register                       → 회원가입
/forgot-password                → 비밀번호 찾기
/reset-password/:token          → 비밀번호 재설정

# 공통 페이지 (인증 필요)
/                               → 대시보드 리다이렉트
/dashboard                      → 대시보드 (역할별 다른 뷰)
/profile                        → 내 프로필
/settings                       → 개인 설정

# 사용자 페이지 (USER)
/courses                        → 수강 가능한 강의 목록
/courses/:id                    → 강의 상세
/my-enrollments                 → 내 수강 목록
/my-enrollments/:id             → 수강 상세/진도

# 강사 페이지 (INSTRUCTOR)
/instructor/courses             → 담당 강의 관리
/instructor/courses/:id         → 담당 강의 상세
/instructor/students            → 수강생 관리
/instructor/applications        → 강의 개설 신청

# 운영자 페이지 (OPERATOR)
/admin/users                    → 사용자 관리
/admin/courses                  → 강의 관리
/admin/courses/:id              → 강의 상세 관리
/admin/courses/:id/terms        → 차수 관리
/admin/enrollments              → 수강신청 관리
/admin/course-applications      → 강의 개설 신청 관리

# 테넌트 관리자 페이지 (TENANT_ADMIN)
/tenant-admin/dashboard         → 테넌트 대시보드
/tenant-admin/users             → 사용자 관리 (운영자 포함)
/tenant-admin/operators         → 운영자 관리
/tenant-admin/settings          → 테넌트 설정
/tenant-admin/branding          → 브랜딩 설정
/tenant-admin/labels            → 라벨 커스터마이징
## Phase 2
/tenant-admin/statistics        → 테넌트 통계
/tenant-admin/audit-logs        → 감사 로그
/tenant-admin/announcements     → 공지사항 관리
## Phase 3
/tenant-admin/layout            → 레이아웃 설정
/tenant-admin/security          → 보안 설정
/tenant-admin/permissions       → 운영자 권한 관리
/tenant-admin/email-templates   → 이메일 템플릿
/tenant-admin/import            → CSV 가져오기
/tenant-admin/export            → 데이터 내보내기
/tenant-admin/api-keys          → API 키 관리

# 슈퍼 관리자 페이지 (SUPER_ADMIN)
/super-admin/dashboard          → 전체 플랫폼 대시보드
/super-admin/tenants            → 테넌트 관리
/super-admin/tenants/:id        → 테넌트 상세
/super-admin/tenants/new        → 테넌트 생성
## Phase 2
/super-admin/statistics         → 전체 통계
/super-admin/usage              → 사용량 모니터링
/super-admin/audit-logs         → 전체 감사 로그
/super-admin/announcements      → 글로벌 공지사항
```

---

## 역할별 페이지 접근권한

### 역할 계층
```
SUPER_ADMIN > TENANT_ADMIN > OPERATOR > INSTRUCTOR > USER
```

### 접근 권한 매트릭스

| 경로 패턴 | SUPER_ADMIN | TENANT_ADMIN | OPERATOR | INSTRUCTOR | USER |
|-----------|:-----------:|:------------:|:--------:|:----------:|:----:|
| `/login`, `/register` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/profile`, `/settings` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/courses` (목록) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/my-enrollments` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/instructor/*` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/admin/*` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `/tenant-admin/*` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/super-admin/*` | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Phase 1: Core 페이지

### 로그인 (/login)
**컴포넌트:** `LoginPage.tsx`

**테넌트 브랜딩 적용:**
- 로고 이미지
- 기본 색상
- 플랫폼 이름
- 로그인 배경 이미지 (선택)

**기능:**
- 이메일/비밀번호 입력
- 로그인 버튼
- 회원가입 링크
- 비밀번호 찾기 링크
- 에러 메시지 표시

**상태:**
```typescript
interface LoginForm {
  email: string;
  password: string;
}
```

**API 호출:**
- `GET /api/public/tenants/by-subdomain/{subdomain}` (브랜딩)
- `POST /api/auth/login`

**성공 시:**
- accessToken, refreshToken 저장 (localStorage)
- `/dashboard`로 리다이렉트

---

### 대시보드 (/dashboard)
**컴포넌트:** `DashboardPage.tsx`

**역할별 표시 내용:**

| 역할 | 표시 내용 |
|------|----------|
| **USER** | 내 수강 현황, 진행중 강의, 최근 활동 |
| **INSTRUCTOR** | 담당 강의 통계, 수강생 현황, 최근 신청 |
| **OPERATOR** | 전체 통계, 최근 신청 목록, 빠른 작업 |
| **TENANT_ADMIN** | 테넌트 통계, 사용량 현황, 알림 |
| **SUPER_ADMIN** | 플랫폼 전체 통계, 테넌트 현황 |

**공통 카드:**
```typescript
interface DashboardCard {
  title: string;
  value: number | string;
  change?: number;  // 전주 대비 변화율
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red';
}
```

**차트 컴포넌트:**
- `UserRoleChart` - 사용자 역할 분포 (파이 차트)
- `TermStatusChart` - 차수 상태 현황 (도넛 차트)
- `EnrollmentTrendChart` - 수강 추이 (라인 차트)
- `CourseProgressChart` - 강의별 진도 (바 차트)

---

### 사용자 관리 (/admin/users)
**컴포넌트:** `UserManagementPage.tsx`

**기능:**
- 사용자 목록 테이블 (페이지네이션)
- 역할/상태 필터
- 검색 (이메일, 이름)
- 사용자 추가 모달
- 사용자 수정 모달
- 사용자 삭제 (확인 다이얼로그)

**테이블 컬럼:**
| 컬럼 | 정렬 | 필터 |
|------|------|------|
| 이메일 | ✅ | 검색 |
| 이름 | ✅ | 검색 |
| 역할 | ❌ | 드롭다운 |
| 상태 | ❌ | 드롭다운 |
| 가입일 | ✅ | ❌ |
| 마지막 로그인 | ✅ | ❌ |
| 액션 | ❌ | ❌ |

**역할 필터 옵션:**
- TENANT_ADMIN: USER, INSTRUCTOR, OPERATOR만 표시
- OPERATOR: USER, INSTRUCTOR만 표시

---

### 강의 관리 (/admin/courses)
**컴포넌트:** `CourseManagementPage.tsx`

**기능:**
- 강의 카드 그리드 / 테이블 뷰 전환
- 상태별 탭 (전체/DRAFT/PENDING/APPROVED/REJECTED)
- 카테고리 필터
- 검색
- 강의 추가 버튼
- 강의 승인/거절 (PENDING 상태)

**강의 카드 내용:**
```typescript
interface CourseCard {
  id: number;
  title: string;
  category: string;
  status: CourseStatus;
  termCount: number;
  enrollmentCount: number;
  instructors: string[];
  createdAt: string;
}
```

---

### 강의 상세 (/admin/courses/:id)
**컴포넌트:** `CourseDetailPage.tsx`

**탭 구조:**
1. **개요** - 강의 정보, 수정
2. **차수 관리** - 차수 목록, CRUD
3. **강사 배정** - 강사 목록, 배정/해제
4. **수강생** - 차수별 수강생 목록

**차수 테이블:**
| 컬럼 | 설명 |
|------|------|
| 차수 | n차 |
| 기간 | 시작일 ~ 종료일 |
| 정원 | 등록/전체 |
| 상태 | 배지 (SCHEDULED/ONGOING/COMPLETED/CANCELLED) |
| 액션 | 수정/삭제/상세 |

---

### 수강신청 관리 (/admin/enrollments)
**컴포넌트:** `EnrollmentManagementPage.tsx`

**기능:**
- 신청 목록 테이블
- 상태별 필터 (ENROLLED/CANCELLED/COMPLETED)
- 강의/차수별 필터
- 개별 취소 처리

**테이블 컬럼:**
| 컬럼 | 설명 |
|------|------|
| 수강자 | 이름 (이메일) |
| 강의 | 강의명 - n차 |
| 등록일 | 날짜/시간 |
| 상태 | 배지 |
| 진도 | 프로그레스 바 |
| 액션 | 상세/취소 버튼 |

---

### 테넌트 설정 (/tenant-admin/settings)
**컴포넌트:** `TenantSettingsPage.tsx`

**탭 구조:**
1. **기본 정보** - 테넌트명, 서브도메인 (읽기전용)
2. **브랜딩** - 로고, 색상, 파비콘
3. **라벨** - 플랫폼명, 강의/차수 명칭
4. **사용량** - 현재 사용량, 한도

**브랜딩 설정:**
```typescript
interface BrandingSettings {
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  loginBackgroundUrl?: string;
}
```

**라벨 설정:**
```typescript
interface LabelSettings {
  platformName: string;    // "TechCorp Academy"
  courseLabel: string;     // "교육과정" / "프로그램"
  termLabel: string;       // "기수" / "차수" / "회차"
}
```

---

### 슈퍼 관리자 - 테넌트 관리 (/super-admin/tenants)
**컴포넌트:** `TenantManagementPage.tsx`

**기능:**
- 테넌트 목록 테이블
- 상태별 필터 (ACTIVE/SUSPENDED/PENDING)
- 플랜별 필터 (FREE/STANDARD/ENTERPRISE)
- 테넌트 생성
- 테넌트 상태 변경

**테이블 컬럼:**
| 컬럼 | 설명 |
|------|------|
| 테넌트명 | 이름 + 서브도메인 |
| 플랜 | FREE/STANDARD/ENTERPRISE 배지 |
| 사용자 수 | 현재/최대 |
| 강의 수 | 현재/최대 |
| 상태 | ACTIVE/SUSPENDED 배지 |
| 생성일 | 날짜 |
| 액션 | 상세/정지/활성화 |

---

## Phase 2: 통계/모니터링 페이지

### SUPER_ADMIN 통계 (/super-admin/statistics)
**컴포넌트:** `SuperAdminStatisticsPage.tsx`

**카드 섹션:**
- 전체 테넌트 수 (활성/비활성)
- 전체 사용자 수
- 전체 강의 수
- 월간 활성 사용자 (MAU)
- 총 스토리지 사용량

**차트:**
1. **테넌트 성장 추이** (라인 차트)
2. **플랜별 테넌트 분포** (파이 차트)
3. **테넌트별 사용량 비교** (바 차트)
4. **월별 수강 완료율** (라인 차트)

**테넌트 순위 테이블:**
- 사용자 수 Top 10
- 강의 수 Top 10
- 활동량 Top 10

---

### TENANT_ADMIN 통계 (/tenant-admin/statistics)
**컴포넌트:** `TenantStatisticsPage.tsx`

**카드 섹션:**
- 총 사용자 수 / 활성 사용자
- 총 강의 수 / 진행중 강의
- 총 수강 / 완료 수강
- 평균 수료율
- 스토리지 사용량

**차트:**
1. **역할별 사용자 분포** (도넛 차트)
2. **월별 신규 가입자 추이** (라인 차트)
3. **강의별 수강생 수** (바 차트)
4. **수강 완료율 추이** (라인 차트)

**필터:**
- 기간 선택 (7일/30일/90일/1년/커스텀)
- 강의 선택

---

### 감사 로그 (/tenant-admin/audit-logs)
**컴포넌트:** `AuditLogsPage.tsx`

**기능:**
- 로그 목록 테이블
- 액션 타입 필터 (LOGIN/CREATE/UPDATE/DELETE)
- 엔티티 타입 필터 (USER/COURSE/ENROLLMENT)
- 사용자 필터
- 기간 필터
- 상세 보기 모달

**테이블 컬럼:**
| 컬럼 | 설명 |
|------|------|
| 일시 | 날짜/시간 |
| 사용자 | 이름 (이메일) |
| 액션 | LOGIN/CREATE/UPDATE/DELETE 배지 |
| 대상 | 엔티티 타입 + ID |
| IP | IP 주소 |
| 상세 | 변경 내용 (JSON) |

---

### 공지사항 관리 (/tenant-admin/announcements)
**컴포넌트:** `AnnouncementsPage.tsx`

**기능:**
- 공지사항 목록
- 공지사항 작성/수정/삭제
- 표시 기간 설정
- 우선순위 설정 (HIGH/NORMAL/LOW)
- 미리보기

**공지 카드:**
```typescript
interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  startDate: string;
  endDate: string;
  isActive: boolean;
}
```

---

## Phase 3: 고급 설정 페이지

### 레이아웃 설정 (/tenant-admin/layout)
**컴포넌트:** `LayoutSettingsPage.tsx`

**설정 항목:**
- 사이드바 위치 (LEFT/RIGHT)
- 사이드바 기본 상태 (펼침/접힘)
- 헤더 스타일 (FIXED/STATIC)
- 푸터 표시 여부
- 메뉴 항목 순서/표시 설정
- 커스텀 CSS (고급)

**미리보기:**
- 실시간 레이아웃 미리보기 패널

---

### 보안 설정 (/tenant-admin/security)
**컴포넌트:** `SecuritySettingsPage.tsx`

**설정 섹션:**

**1. 비밀번호 정책**
```typescript
interface PasswordPolicy {
  minLength: number;           // 최소 길이 (8-20)
  requireUppercase: boolean;   // 대문자 필수
  requireLowercase: boolean;   // 소문자 필수
  requireNumbers: boolean;     // 숫자 필수
  requireSpecialChars: boolean; // 특수문자 필수
  expirationDays: number;      // 만료 기간 (0=무제한)
}
```

**2. 세션 정책**
```typescript
interface SessionPolicy {
  maxConcurrentSessions: number;  // 동시 세션 수
  sessionTimeoutMinutes: number;  // 세션 타임아웃
  rememberMeDays: number;         // 자동 로그인 유지 기간
}
```

**3. 로그인 정책**
```typescript
interface LoginPolicy {
  maxFailedAttempts: number;      // 최대 실패 횟수
  lockoutDurationMinutes: number; // 잠금 시간
  requireMfa: boolean;            // MFA 필수 여부
}
```

**4. IP 화이트리스트**
- IP 주소 목록 관리
- CIDR 표기 지원

---

### 운영자 권한 관리 (/tenant-admin/permissions)
**컴포넌트:** `OperatorPermissionsPage.tsx`

**운영자 목록:**
- 운영자별 권한 설정

**권한 체크박스 매트릭스:**
| 기능 | 조회 | 생성/수정 | 삭제 |
|------|:----:|:--------:|:----:|
| 사용자 관리 | ☑️ | ☑️ | ☐ |
| 강의 관리 | ☑️ | ☑️ | ☑️ |
| 수강 관리 | ☑️ | ☑️ | ☐ |
| 리포트 접근 | ☑️ | - | - |

---

### 이메일 템플릿 (/tenant-admin/email-templates)
**컴포넌트:** `EmailTemplatesPage.tsx`

**템플릿 유형:**
- `WELCOME` - 회원가입 환영
- `PASSWORD_RESET` - 비밀번호 재설정
- `ENROLLMENT_CONFIRM` - 수강 등록 확인
- `COURSE_COMPLETE` - 수강 완료

**편집기:**
- WYSIWYG 에디터
- 변수 삽입 기능 ({{userName}}, {{platformName}} 등)
- 미리보기
- 테스트 발송

---

### CSV 가져오기 (/tenant-admin/import)
**컴포넌트:** `ImportPage.tsx`

**기능:**
1. **파일 업로드**
   - 드래그 앤 드롭
   - CSV/XLSX 지원

2. **필드 매핑**
   - CSV 컬럼 ↔ 시스템 필드 매핑
   - 필수 필드 검증

3. **미리보기**
   - 처음 10개 행 미리보기
   - 오류 행 표시

4. **실행 & 결과**
   - 진행률 표시
   - 성공/실패 카운트
   - 오류 상세 로그

---

### 데이터 내보내기 (/tenant-admin/export)
**컴포넌트:** `ExportPage.tsx`

**내보내기 대상:**
- 사용자 목록
- 강의 목록
- 수강 목록

**옵션:**
- 파일 형식 (CSV/XLSX)
- 포함할 필드 선택
- 필터 조건 (상태, 기간 등)

---

### API 키 관리 (/tenant-admin/api-keys)
**컴포넌트:** `ApiKeysPage.tsx`

**기능:**
- API 키 목록
- 새 키 생성
- 권한 설정
- 만료일 설정
- 키 삭제
- 마지막 사용 시간 표시

**키 생성 모달:**
```typescript
interface ApiKeyForm {
  name: string;
  permissions: string[];  // ['read:users', 'write:enrollments', ...]
  expiresAt: string;
}
```

---

## 공통 컴포넌트

### Layout
```
Header (테넌트 브랜딩 적용)
├── Logo (테넌트 로고)
├── Navigation (역할별)
├── 공지사항 알림
└── UserMenu (프로필, 로그아웃)

Sidebar (접기 가능, 테넌트 설정 적용)
├── 메뉴 항목 (역할별)
└── 현재 위치 표시

Main Content
└── Page Component

Footer (선택적, 테넌트 설정)
```

### 공통 UI 컴포넌트
| 컴포넌트 | 위치 | 용도 |
|----------|------|------|
| `Button` | components/common | 버튼 (Primary/Secondary/Danger) |
| `Input` | components/common | 입력 필드 |
| `Select` | components/common | 드롭다운 |
| `Modal` | components/common | 모달 다이얼로그 |
| `Table` | components/common | 데이터 테이블 |
| `Pagination` | components/common | 페이지네이션 |
| `Badge` | components/common | 상태 배지 |
| `Card` | components/common | 카드 컨테이너 |
| `Toast` | components/common | 알림 토스트 |
| `Tabs` | components/common | 탭 네비게이션 |
| `Chart` | components/common | 차트 래퍼 (Recharts) |
| `FileUpload` | components/common | 파일 업로드 |
| `DatePicker` | components/common | 날짜 선택 |
| `ColorPicker` | components/common | 색상 선택 |
| `RichTextEditor` | components/common | WYSIWYG 에디터 |

---

## 상태 배지 색상

### 사용자 상태
| 상태 | 색상 | TailwindCSS |
|------|------|-------------|
| ACTIVE | 초록 | `bg-green-100 text-green-800` |
| INACTIVE | 회색 | `bg-gray-100 text-gray-800` |
| SUSPENDED | 빨강 | `bg-red-100 text-red-800` |

### 강의 상태 (CourseStatus)
| 상태 | 색상 | TailwindCSS |
|------|------|-------------|
| DRAFT | 회색 | `bg-gray-100 text-gray-800` |
| PENDING | 노랑 | `bg-yellow-100 text-yellow-800` |
| APPROVED | 초록 | `bg-green-100 text-green-800` |
| REJECTED | 빨강 | `bg-red-100 text-red-800` |

### 차수 상태 (TermStatus)
| 상태 | 색상 | TailwindCSS |
|------|------|-------------|
| SCHEDULED | 파랑 | `bg-blue-100 text-blue-800` |
| ONGOING | 초록 | `bg-green-100 text-green-800` |
| COMPLETED | 회색 | `bg-gray-100 text-gray-800` |
| CANCELLED | 빨강 | `bg-red-100 text-red-800` |

### 수강 상태 (EnrollmentStatus)
| 상태 | 색상 | TailwindCSS |
|------|------|-------------|
| ENROLLED | 파랑 | `bg-blue-100 text-blue-800` |
| COMPLETED | 초록 | `bg-green-100 text-green-800` |
| CANCELLED | 빨강 | `bg-red-100 text-red-800` |

### 테넌트 상태
| 상태 | 색상 | TailwindCSS |
|------|------|-------------|
| ACTIVE | 초록 | `bg-green-100 text-green-800` |
| SUSPENDED | 빨강 | `bg-red-100 text-red-800` |
| PENDING | 노랑 | `bg-yellow-100 text-yellow-800` |

### 플랜 배지
| 플랜 | 색상 | TailwindCSS |
|------|------|-------------|
| FREE | 회색 | `bg-gray-100 text-gray-800` |
| STANDARD | 파랑 | `bg-blue-100 text-blue-800` |
| ENTERPRISE | 보라 | `bg-purple-100 text-purple-800` |

---

## 역할별 메뉴

### SUPER_ADMIN
```
대시보드
├── 전체 현황
테넌트 관리
├── 테넌트 목록
├── 테넌트 생성
통계 (Phase 2)
├── 전체 통계
├── 사용량 모니터링
시스템 (Phase 2)
├── 감사 로그
├── 글로벌 공지
```

### TENANT_ADMIN
```
대시보드
├── 테넌트 현황
사용자 관리
├── 사용자 목록
├── 운영자 관리
강의 관리
├── 강의 목록
├── 수강신청 관리
설정
├── 기본 설정
├── 브랜딩
├── 라벨
통계 (Phase 2)
├── 테넌트 통계
├── 감사 로그
├── 공지사항
고급 설정 (Phase 3)
├── 레이아웃
├── 보안
├── 운영자 권한
├── 이메일 템플릿
├── 가져오기/내보내기
├── API 키
```

### OPERATOR
```
대시보드
├── 운영 현황
사용자 관리
├── 사용자 목록
강의 관리
├── 강의 목록
├── 차수 관리
├── 강의 개설 신청
수강 관리
├── 수강신청 관리
```

### INSTRUCTOR
```
대시보드
├── 담당 강의 현황
강의 관리
├── 담당 강의
├── 수강생 관리
신청
├── 강의 개설 신청
```

### USER
```
대시보드
├── 내 학습 현황
강의
├── 강의 목록
├── 강의 상세
내 학습
├── 수강 목록
├── 수강 진도
```

---

## 라우트 가드

### TenantRoute
```typescript
// 테넌트 식별 및 브랜딩 로드
const TenantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const subdomain = getSubdomain();
  const { data: tenant, isLoading } = useTenantBranding(subdomain);

  if (isLoading) return <TenantLoadingSkeleton />;
  if (!tenant) return <TenantNotFound />;

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
};
```

### ProtectedRoute
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
};
```

### 사용 예시
```tsx
<Routes>
  {/* 공개 라우트 */}
  <Route path="/login" element={<LoginPage />} />

  {/* 인증 필요 */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>

  {/* OPERATOR 이상 */}
  <Route element={<ProtectedRoute allowedRoles={['OPERATOR', 'TENANT_ADMIN', 'SUPER_ADMIN']} />}>
    <Route path="/admin/*" element={<AdminRoutes />} />
  </Route>

  {/* TENANT_ADMIN 이상 */}
  <Route element={<ProtectedRoute allowedRoles={['TENANT_ADMIN', 'SUPER_ADMIN']} />}>
    <Route path="/tenant-admin/*" element={<TenantAdminRoutes />} />
  </Route>

  {/* SUPER_ADMIN 전용 */}
  <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
    <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
  </Route>
</Routes>
```

### 인증 체크 순서
1. 테넌트 서브도메인 확인
2. 테넌트 브랜딩 로드
3. accessToken 존재 확인
4. 토큰 만료 확인
5. 만료 시 refreshToken으로 갱신
6. 갱신 실패 시 로그인 페이지로 리다이렉트
7. 역할 확인 (allowedRoles)
8. 권한 없으면 403 페이지
