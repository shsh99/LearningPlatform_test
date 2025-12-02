# API Context

> AI가 API 관련 작업 시 참조하는 상세 명세
> **멀티테넌트 B2B SaaS** 환경 기준

---

## 목차

1. [공통 사항](#공통-사항)
2. [Phase 1: Core API](#phase-1-core-api)
   - [공개 API](#공개-api-인증-불필요)
   - [인증 API](#인증-api)
   - [사용자 API](#사용자-api)
   - [강의 API](#강의-api)
   - [차수 API](#차수-api)
   - [수강신청 API](#수강신청-api)
   - [신청/승인 API](#신청승인-api)
   - [테넌트 관리 API](#테넌트-관리-api)
3. [Phase 2: 통계/모니터링 API](#phase-2-통계모니터링-api)
4. [Phase 3: 고급 커스터마이징 API](#phase-3-고급-커스터마이징-api)
5. [에러 응답](#에러-응답)
6. [권한 매트릭스](#권한-매트릭스)

---

## 공통 사항

### 인증 헤더
```
Authorization: Bearer {accessToken}
```

### 테넌트 식별
- 로그인 시 사용자의 `tenantId`가 JWT에 포함됨
- 모든 데이터 조회/수정 시 자동으로 테넌트 필터링 적용
- 크로스 테넌트 접근 시 404 반환 (보안)

### 역할 계층
```
SUPER_ADMIN > TENANT_ADMIN > OPERATOR > INSTRUCTOR > USER
```

### 페이징 응답 형식
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20,
  "first": true,
  "last": false
}
```

---

## Phase 1: Core API

### 공개 API (인증 불필요)

#### GET /api/public/tenants/by-subdomain/{subdomain}
테넌트 공개 정보 조회 (로그인 페이지 브랜딩용)

**Response (200):**
```json
{
  "id": 1,
  "name": "TechCorp",
  "subdomain": "techcorp",
  "branding": {
    "logoUrl": "https://cdn.example.com/techcorp/logo.png",
    "primaryColor": "#1E88E5",
    "secondaryColor": "#FFC107"
  },
  "labels": {
    "platformName": "TechCorp Learning Hub",
    "courseLabel": "교육과정",
    "termLabel": "기수"
  }
}
```

#### GET /api/public/tenants/{id}/branding
테넌트 브랜딩 정보만 조회

**Response (200):**
```json
{
  "logoUrl": "https://cdn.example.com/techcorp/logo.png",
  "faviconUrl": "https://cdn.example.com/techcorp/favicon.ico",
  "primaryColor": "#1E88E5",
  "secondaryColor": "#FFC107",
  "loginBackgroundUrl": null
}
```

---

### 인증 API

#### POST /api/auth/login
**Request:**
```json
{
  "email": "user@techcorp.com",
  "password": "password123!",
  "tenantId": 1
}
```
**Response (200):**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": 1,
    "email": "user@techcorp.com",
    "name": "홍길동",
    "role": "USER",
    "tenantId": 1,
    "tenantName": "TechCorp"
  }
}
```

#### POST /api/auth/register
**Request:**
```json
{
  "email": "newuser@techcorp.com",
  "password": "password123!",
  "name": "김철수",
  "tenantId": 1
}
```
**Response (201):**
```json
{
  "id": 2,
  "email": "newuser@techcorp.com",
  "name": "김철수",
  "role": "USER",
  "tenantId": 1
}
```

#### POST /api/auth/refresh
**Request:**
```json
{
  "refreshToken": "eyJhbG..."
}
```
**Response (200):**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

#### POST /api/auth/logout
**Response (200):** `{ "message": "로그아웃 되었습니다." }`

#### POST /api/auth/password/reset-request
**Request:**
```json
{
  "email": "user@techcorp.com"
}
```
**Response (200):** `{ "message": "비밀번호 재설정 이메일을 발송했습니다." }`

#### POST /api/auth/password/reset
**Request:**
```json
{
  "token": "reset-token-uuid",
  "newPassword": "newPassword123!"
}
```
**Response (200):** `{ "message": "비밀번호가 변경되었습니다." }`

---

### 사용자 API

#### GET /api/users
**Query Parameters:**
- `page` (default: 0)
- `size` (default: 20)
- `role` (optional): USER/INSTRUCTOR/OPERATOR/ADMIN/TENANT_ADMIN
- `status` (optional): ACTIVE/INACTIVE/SUSPENDED
- `search` (optional): 이름/이메일 검색

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "email": "admin@techcorp.com",
      "name": "관리자",
      "role": "TENANT_ADMIN",
      "status": "ACTIVE",
      "tenantId": 1,
      "createdAt": "2024-01-01T00:00:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5
}
```

#### GET /api/users/{id}
**Response (200):**
```json
{
  "id": 1,
  "email": "user@techcorp.com",
  "name": "홍길동",
  "role": "USER",
  "status": "ACTIVE",
  "tenantId": 1,
  "createdAt": "2024-01-01T00:00:00",
  "lastLoginAt": "2024-03-15T10:30:00"
}
```

#### PUT /api/users/{id}
**Request:**
```json
{
  "name": "김영희",
  "role": "INSTRUCTOR"
}
```

#### DELETE /api/users/{id}
**Response (204):** No Content

#### GET /api/users/me
현재 로그인한 사용자 정보

**Response (200):**
```json
{
  "id": 1,
  "email": "user@techcorp.com",
  "name": "홍길동",
  "role": "USER",
  "tenantId": 1,
  "tenant": {
    "name": "TechCorp",
    "subdomain": "techcorp"
  }
}
```

---

### 강의 API

#### GET /api/courses
**Query Parameters:**
- `page`, `size`
- `status`: DRAFT/PENDING/APPROVED/REJECTED
- `category`: 카테고리 필터
- `search`: 제목 검색

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Spring Boot 기초",
      "description": "Spring Boot 입문 강의",
      "category": "백엔드",
      "status": "APPROVED",
      "termCount": 3,
      "tenantId": 1,
      "createdAt": "2024-01-01T00:00:00"
    }
  ],
  "totalElements": 50,
  "totalPages": 3
}
```

#### GET /api/courses/{id}
**Response (200):**
```json
{
  "id": 1,
  "title": "Spring Boot 기초",
  "description": "Spring Boot 입문 강의",
  "category": "백엔드",
  "status": "APPROVED",
  "tenantId": 1,
  "terms": [
    {
      "id": 1,
      "termNumber": 1,
      "startDate": "2024-03-01",
      "endDate": "2024-03-31",
      "capacity": 30,
      "enrolledCount": 25,
      "status": "COMPLETED"
    }
  ],
  "instructors": [
    {
      "id": 5,
      "name": "김강사",
      "email": "instructor@techcorp.com"
    }
  ]
}
```

#### POST /api/courses
**Request:**
```json
{
  "title": "React 실전",
  "description": "React를 활용한 실전 프로젝트",
  "category": "프론트엔드"
}
```
**Response (201):**
```json
{
  "id": 10,
  "title": "React 실전",
  "status": "DRAFT",
  "tenantId": 1
}
```

#### PUT /api/courses/{id}
**Request:**
```json
{
  "title": "React 실전 (개정판)",
  "description": "업데이트된 설명"
}
```

#### DELETE /api/courses/{id}
**Response (204):** No Content

#### PUT /api/courses/{id}/status
강의 상태 변경 (승인 흐름)

**Request:**
```json
{
  "status": "APPROVED"
}
```

---

### 차수 API

#### GET /api/courses/{courseId}/terms
**Response (200):**
```json
[
  {
    "id": 1,
    "termNumber": 1,
    "startDate": "2024-03-01",
    "endDate": "2024-03-31",
    "capacity": 30,
    "enrolledCount": 25,
    "status": "COMPLETED"
  },
  {
    "id": 2,
    "termNumber": 2,
    "startDate": "2024-04-01",
    "endDate": "2024-04-30",
    "capacity": 30,
    "enrolledCount": 15,
    "status": "ONGOING"
  }
]
```

#### POST /api/courses/{courseId}/terms
**Request:**
```json
{
  "termNumber": 3,
  "startDate": "2024-05-01",
  "endDate": "2024-05-31",
  "capacity": 30
}
```

#### PUT /api/terms/{id}
**Request:**
```json
{
  "capacity": 35,
  "endDate": "2024-06-05"
}
```

#### DELETE /api/terms/{id}
**Response (204):** No Content

---

### 수강신청 API

#### GET /api/enrollments
**Query Parameters:**
- `page`, `size`
- `status`: ENROLLED/CANCELLED/COMPLETED
- `userId`: 특정 사용자 필터
- `courseTermId`: 특정 차수 필터

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "userId": 10,
      "userName": "홍길동",
      "courseTermId": 5,
      "courseTitle": "Spring Boot 기초",
      "termNumber": 2,
      "status": "ENROLLED",
      "enrolledAt": "2024-03-15T10:30:00"
    }
  ]
}
```

#### POST /api/enrollments
**Request:**
```json
{
  "courseTermId": 5
}
```
**Response (201):**
```json
{
  "id": 1,
  "status": "ENROLLED",
  "enrolledAt": "2024-03-15T10:30:00"
}
```

#### DELETE /api/enrollments/{id}
수강 취소

**Response (204):** No Content

#### GET /api/enrollments/my
내 수강 목록

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "courseTitle": "Spring Boot 기초",
      "termNumber": 2,
      "status": "ENROLLED",
      "enrolledAt": "2024-03-15T10:30:00",
      "progress": 45
    }
  ]
}
```

---

### 신청/승인 API

#### GET /api/course-applications
강의 개설 신청 목록 (OPERATOR 이상)

**Query Parameters:**
- `page`, `size`
- `status`: PENDING/APPROVED/REJECTED

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "instructorId": 5,
      "instructorName": "김강사",
      "title": "신규 강의 제안",
      "description": "강의 설명...",
      "status": "PENDING",
      "createdAt": "2024-03-10T09:00:00"
    }
  ]
}
```

#### POST /api/course-applications
강의 개설 신청 (INSTRUCTOR)

**Request:**
```json
{
  "title": "신규 강의 제안",
  "description": "강의 설명...",
  "category": "백엔드"
}
```

#### PUT /api/course-applications/{id}/approve
**Response (200):**
```json
{
  "id": 1,
  "status": "APPROVED",
  "processedAt": "2024-03-15T14:00:00",
  "courseId": 10
}
```

#### PUT /api/course-applications/{id}/reject
**Request:**
```json
{
  "reason": "중복 강의가 존재합니다."
}
```

---

### 테넌트 관리 API

#### GET /api/tenants (SUPER_ADMIN 전용)
전체 테넌트 목록

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "TechCorp",
      "subdomain": "techcorp",
      "status": "ACTIVE",
      "plan": "ENTERPRISE",
      "userCount": 150,
      "courseCount": 25,
      "createdAt": "2024-01-01T00:00:00"
    }
  ]
}
```

#### POST /api/tenants (SUPER_ADMIN 전용)
**Request:**
```json
{
  "name": "NewCorp",
  "subdomain": "newcorp",
  "plan": "STANDARD",
  "adminEmail": "admin@newcorp.com",
  "adminName": "관리자"
}
```

#### GET /api/tenants/{id} (SUPER_ADMIN 전용)
**Response (200):**
```json
{
  "id": 1,
  "name": "TechCorp",
  "subdomain": "techcorp",
  "status": "ACTIVE",
  "plan": "ENTERPRISE",
  "settings": {
    "maxUsers": 500,
    "maxCourses": 100,
    "maxStorage": 10737418240
  },
  "branding": {
    "logoUrl": "...",
    "primaryColor": "#1E88E5"
  }
}
```

#### PUT /api/tenants/{id} (SUPER_ADMIN 전용)
**Request:**
```json
{
  "name": "TechCorp Updated",
  "plan": "ENTERPRISE_PLUS"
}
```

#### PUT /api/tenants/{id}/status (SUPER_ADMIN 전용)
**Request:**
```json
{
  "status": "SUSPENDED"
}
```

---

#### GET /api/tenant/settings (TENANT_ADMIN)
자신의 테넌트 설정 조회

**Response (200):**
```json
{
  "tenantId": 1,
  "name": "TechCorp",
  "branding": {
    "logoUrl": "...",
    "primaryColor": "#1E88E5",
    "secondaryColor": "#FFC107"
  },
  "labels": {
    "platformName": "TechCorp Learning Hub",
    "courseLabel": "교육과정",
    "termLabel": "기수"
  },
  "settings": {
    "maxUsers": 500,
    "maxCourses": 100,
    "currentUsers": 150,
    "currentCourses": 25
  }
}
```

#### PUT /api/tenant/branding (TENANT_ADMIN)
**Request:**
```json
{
  "logoUrl": "https://cdn.example.com/new-logo.png",
  "primaryColor": "#2196F3",
  "secondaryColor": "#FF9800"
}
```

#### PUT /api/tenant/labels (TENANT_ADMIN)
**Request:**
```json
{
  "platformName": "TechCorp Academy",
  "courseLabel": "프로그램",
  "termLabel": "차수"
}
```

---

## Phase 2: 통계/모니터링 API

### SUPER_ADMIN 통계

#### GET /api/super-admin/stats/overview
전체 플랫폼 통계

**Response (200):**
```json
{
  "totalTenants": 15,
  "activeTenants": 12,
  "totalUsers": 5000,
  "totalCourses": 350,
  "totalEnrollments": 15000,
  "monthlyActiveUsers": 3200,
  "storageUsed": 107374182400,
  "tenantsByPlan": {
    "FREE": 5,
    "STANDARD": 7,
    "ENTERPRISE": 3
  }
}
```

#### GET /api/super-admin/stats/tenants
테넌트별 상세 통계

**Query Parameters:**
- `page`, `size`
- `sortBy`: userCount/courseCount/storageUsed
- `order`: asc/desc

**Response (200):**
```json
{
  "content": [
    {
      "tenantId": 1,
      "tenantName": "TechCorp",
      "plan": "ENTERPRISE",
      "userCount": 150,
      "activeUserCount": 120,
      "courseCount": 25,
      "enrollmentCount": 500,
      "storageUsed": 5368709120,
      "lastActivityAt": "2024-03-15T10:30:00"
    }
  ]
}
```

#### GET /api/super-admin/stats/trends
시간별 추이 데이터

**Query Parameters:**
- `period`: daily/weekly/monthly
- `startDate`, `endDate`
- `metric`: users/courses/enrollments

**Response (200):**
```json
{
  "period": "monthly",
  "data": [
    { "date": "2024-01", "value": 4500 },
    { "date": "2024-02", "value": 4800 },
    { "date": "2024-03", "value": 5000 }
  ]
}
```

---

### TENANT_ADMIN 통계

#### GET /api/tenant-admin/stats/overview
테넌트 내 통계

**Response (200):**
```json
{
  "totalUsers": 150,
  "activeUsers": 120,
  "totalCourses": 25,
  "activeCourses": 18,
  "totalEnrollments": 500,
  "completedEnrollments": 320,
  "averageCompletionRate": 78.5,
  "storageUsed": 5368709120,
  "storageLimit": 10737418240
}
```

#### GET /api/tenant-admin/stats/courses
강의별 통계

**Response (200):**
```json
{
  "content": [
    {
      "courseId": 1,
      "courseTitle": "Spring Boot 기초",
      "totalEnrollments": 120,
      "completedEnrollments": 95,
      "completionRate": 79.2,
      "averageProgress": 85.5,
      "termCount": 5
    }
  ]
}
```

#### GET /api/tenant-admin/stats/users
사용자 활동 통계

**Response (200):**
```json
{
  "usersByRole": {
    "TENANT_ADMIN": 1,
    "OPERATOR": 3,
    "INSTRUCTOR": 10,
    "USER": 136
  },
  "activeUsersLast7Days": 85,
  "activeUsersLast30Days": 120,
  "newUsersThisMonth": 15
}
```

---

### 감사 로그 API

#### GET /api/audit-logs (SUPER_ADMIN/TENANT_ADMIN)
**Query Parameters:**
- `page`, `size`
- `action`: LOGIN/LOGOUT/CREATE/UPDATE/DELETE
- `entityType`: USER/COURSE/ENROLLMENT/TENANT
- `userId`: 특정 사용자 필터
- `startDate`, `endDate`

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "action": "UPDATE",
      "entityType": "COURSE",
      "entityId": 5,
      "userId": 10,
      "userName": "홍길동",
      "details": {
        "field": "status",
        "oldValue": "DRAFT",
        "newValue": "APPROVED"
      },
      "ipAddress": "192.168.1.100",
      "createdAt": "2024-03-15T10:30:00"
    }
  ]
}
```

---

### 사용량 통계 API

#### GET /api/usage-statistics (SUPER_ADMIN)
**Query Parameters:**
- `tenantId` (optional)
- `period`: daily/weekly/monthly
- `startDate`, `endDate`

**Response (200):**
```json
{
  "content": [
    {
      "date": "2024-03-15",
      "tenantId": 1,
      "activeUsers": 85,
      "apiCalls": 12500,
      "storageUsed": 5368709120,
      "bandwidthUsed": 1073741824
    }
  ]
}
```

---

### 공지사항 API

#### GET /api/announcements
**Query Parameters:**
- `page`, `size`
- `scope`: GLOBAL/TENANT
- `active`: true/false

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "시스템 점검 안내",
      "content": "3월 20일 02:00-04:00 시스템 점검 예정입니다.",
      "scope": "GLOBAL",
      "priority": "HIGH",
      "startDate": "2024-03-15T00:00:00",
      "endDate": "2024-03-20T04:00:00",
      "createdAt": "2024-03-14T10:00:00"
    }
  ]
}
```

#### POST /api/announcements (SUPER_ADMIN/TENANT_ADMIN)
**Request:**
```json
{
  "title": "새로운 기능 안내",
  "content": "신규 기능이 추가되었습니다.",
  "scope": "TENANT",
  "priority": "NORMAL",
  "startDate": "2024-03-15T00:00:00",
  "endDate": "2024-03-31T23:59:59"
}
```

---

## Phase 3: 고급 커스터마이징 API

### 레이아웃 설정 API

#### GET /api/tenant/layout-settings (TENANT_ADMIN)
**Response (200):**
```json
{
  "tenantId": 1,
  "sidebarPosition": "LEFT",
  "sidebarCollapsed": false,
  "headerStyle": "FIXED",
  "footerEnabled": true,
  "menuItems": [
    { "key": "dashboard", "label": "대시보드", "visible": true, "order": 1 },
    { "key": "courses", "label": "강의", "visible": true, "order": 2 },
    { "key": "users", "label": "사용자", "visible": true, "order": 3 }
  ],
  "customCss": ""
}
```

#### PUT /api/tenant/layout-settings (TENANT_ADMIN)
**Request:**
```json
{
  "sidebarPosition": "LEFT",
  "headerStyle": "FIXED",
  "menuItems": [
    { "key": "dashboard", "label": "홈", "visible": true, "order": 1 }
  ]
}
```

---

### 보안 설정 API

#### GET /api/tenant/security-settings (TENANT_ADMIN)
**Response (200):**
```json
{
  "tenantId": 1,
  "passwordPolicy": {
    "minLength": 8,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumbers": true,
    "requireSpecialChars": true,
    "expirationDays": 90
  },
  "sessionPolicy": {
    "maxConcurrentSessions": 3,
    "sessionTimeoutMinutes": 30,
    "rememberMeDays": 7
  },
  "loginPolicy": {
    "maxFailedAttempts": 5,
    "lockoutDurationMinutes": 30,
    "requireMfa": false
  },
  "ipWhitelist": []
}
```

#### PUT /api/tenant/security-settings (TENANT_ADMIN)
**Request:**
```json
{
  "passwordPolicy": {
    "minLength": 10,
    "expirationDays": 60
  },
  "loginPolicy": {
    "requireMfa": true
  }
}
```

---

### 운영자 권한 관리 API

#### GET /api/operator-permissions (TENANT_ADMIN)
**Response (200):**
```json
{
  "content": [
    {
      "operatorId": 5,
      "operatorName": "김운영",
      "permissions": {
        "userManagement": { "read": true, "write": true, "delete": false },
        "courseManagement": { "read": true, "write": true, "delete": true },
        "enrollmentManagement": { "read": true, "write": true, "delete": false },
        "reportAccess": { "read": true }
      }
    }
  ]
}
```

#### PUT /api/operator-permissions/{operatorId} (TENANT_ADMIN)
**Request:**
```json
{
  "permissions": {
    "userManagement": { "read": true, "write": true, "delete": true },
    "courseManagement": { "read": true, "write": true, "delete": true }
  }
}
```

---

### 이메일 템플릿 API

#### GET /api/tenant/email-templates (TENANT_ADMIN)
**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "templateType": "WELCOME",
      "subject": "{{platformName}}에 오신 것을 환영합니다!",
      "body": "<html>...",
      "variables": ["platformName", "userName", "loginUrl"],
      "isActive": true
    },
    {
      "id": 2,
      "templateType": "PASSWORD_RESET",
      "subject": "비밀번호 재설정 안내",
      "body": "<html>...",
      "variables": ["userName", "resetUrl", "expirationTime"],
      "isActive": true
    }
  ]
}
```

#### PUT /api/tenant/email-templates/{id} (TENANT_ADMIN)
**Request:**
```json
{
  "subject": "{{platformName}}에 가입해 주셔서 감사합니다!",
  "body": "<html>커스텀 템플릿...</html>"
}
```

---

### CSV 가져오기/내보내기 API

#### POST /api/import/users (TENANT_ADMIN)
**Request:** `multipart/form-data`
- `file`: CSV 파일
- `options`: `{ "skipHeader": true, "defaultRole": "USER" }`

**Response (200):**
```json
{
  "totalRows": 100,
  "successCount": 95,
  "failureCount": 5,
  "errors": [
    { "row": 15, "error": "이메일 형식 오류" },
    { "row": 23, "error": "중복 이메일" }
  ]
}
```

#### GET /api/export/users (TENANT_ADMIN)
**Query Parameters:**
- `format`: csv/xlsx
- `fields`: id,email,name,role,status (comma-separated)

**Response:** 파일 다운로드

#### GET /api/export/enrollments (TENANT_ADMIN)
**Query Parameters:**
- `format`: csv/xlsx
- `courseId` (optional)
- `termId` (optional)
- `status` (optional)

**Response:** 파일 다운로드

---

### API 키 관리 API (Phase 3 확장)

#### GET /api/tenant/api-keys (TENANT_ADMIN)
**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "외부 시스템 연동",
      "keyPrefix": "tk_live_abc...",
      "permissions": ["read:users", "read:courses"],
      "lastUsedAt": "2024-03-15T10:30:00",
      "expiresAt": "2025-03-15T00:00:00",
      "createdAt": "2024-03-01T00:00:00"
    }
  ]
}
```

#### POST /api/tenant/api-keys (TENANT_ADMIN)
**Request:**
```json
{
  "name": "새로운 연동 키",
  "permissions": ["read:users", "read:courses", "write:enrollments"],
  "expiresAt": "2025-12-31T23:59:59"
}
```
**Response (201):**
```json
{
  "id": 2,
  "name": "새로운 연동 키",
  "apiKey": "tk_live_xxxxxxxxxxxxx",
  "message": "API 키는 이 응답에서만 확인 가능합니다. 안전하게 보관하세요."
}
```

#### DELETE /api/tenant/api-keys/{id} (TENANT_ADMIN)
**Response (204):** No Content

---

## 에러 응답

### 형식
```json
{
  "timestamp": "2024-03-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "code": "USER_NOT_FOUND",
  "message": "사용자를 찾을 수 없습니다.",
  "path": "/api/users/999"
}
```

### 주요 에러 코드

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| **인증/권한** |
| UNAUTHORIZED | 401 | 인증 필요 |
| FORBIDDEN | 403 | 권한 없음 |
| TOKEN_EXPIRED | 401 | 토큰 만료 |
| INVALID_TOKEN | 401 | 유효하지 않은 토큰 |
| **사용자** |
| USER_NOT_FOUND | 404 | 사용자 없음 |
| DUPLICATE_EMAIL | 409 | 이메일 중복 |
| INVALID_PASSWORD | 400 | 비밀번호 형식 오류 |
| ACCOUNT_LOCKED | 403 | 계정 잠금 |
| **강의** |
| COURSE_NOT_FOUND | 404 | 강의 없음 |
| TERM_NOT_FOUND | 404 | 차수 없음 |
| TERM_FULL | 400 | 정원 초과 |
| **수강** |
| ALREADY_ENROLLED | 409 | 이미 신청됨 |
| ENROLLMENT_NOT_FOUND | 404 | 수강 정보 없음 |
| **테넌트** |
| TENANT_NOT_FOUND | 404 | 테넌트 없음 |
| TENANT_SUSPENDED | 403 | 테넌트 정지됨 |
| SUBDOMAIN_TAKEN | 409 | 서브도메인 중복 |
| QUOTA_EXCEEDED | 400 | 할당량 초과 |
| **파일** |
| FILE_TOO_LARGE | 400 | 파일 크기 초과 |
| INVALID_FILE_TYPE | 400 | 지원하지 않는 파일 형식 |
| STORAGE_LIMIT_EXCEEDED | 400 | 스토리지 한도 초과 |

---

## 권한 매트릭스

### Phase 1 API

| API | SUPER_ADMIN | TENANT_ADMIN | OPERATOR | INSTRUCTOR | USER |
|-----|:-----------:|:------------:|:--------:|:----------:|:----:|
| **공개 API** |
| GET /api/public/* | ✅ | ✅ | ✅ | ✅ | ✅ |
| **인증** |
| POST /api/auth/* | ✅ | ✅ | ✅ | ✅ | ✅ |
| **사용자** |
| GET /api/users | ✅ | ✅ | ✅ | ❌ | ❌ |
| GET /api/users/{id} | ✅ | ✅ | ✅ | 🔶 | 🔶 |
| PUT /api/users/{id} | ✅ | ✅ | ✅ | 🔶 | 🔶 |
| DELETE /api/users/{id} | ✅ | ✅ | ❌ | ❌ | ❌ |
| **강의** |
| GET /api/courses | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /api/courses | ✅ | ✅ | ✅ | ❌ | ❌ |
| PUT /api/courses/{id} | ✅ | ✅ | ✅ | 🔶 | ❌ |
| DELETE /api/courses/{id} | ✅ | ✅ | ❌ | ❌ | ❌ |
| **수강신청** |
| GET /api/enrollments | ✅ | ✅ | ✅ | 🔶 | 🔶 |
| POST /api/enrollments | ✅ | ✅ | ✅ | ✅ | ✅ |
| DELETE /api/enrollments/{id} | ✅ | ✅ | ✅ | 🔶 | 🔶 |
| **테넌트 (전체)** |
| GET /api/tenants | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/tenants | ✅ | ❌ | ❌ | ❌ | ❌ |
| PUT /api/tenants/{id} | ✅ | ❌ | ❌ | ❌ | ❌ |
| **테넌트 (자신)** |
| GET /api/tenant/settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| PUT /api/tenant/branding | ✅ | ✅ | ❌ | ❌ | ❌ |

### Phase 2 API

| API | SUPER_ADMIN | TENANT_ADMIN | OPERATOR | INSTRUCTOR | USER |
|-----|:-----------:|:------------:|:--------:|:----------:|:----:|
| GET /api/super-admin/stats/* | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/tenant-admin/stats/* | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/audit-logs | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/usage-statistics | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/announcements | ✅ | ✅ | ❌ | ❌ | ❌ |

### Phase 3 API

| API | SUPER_ADMIN | TENANT_ADMIN | OPERATOR | INSTRUCTOR | USER |
|-----|:-----------:|:------------:|:--------:|:----------:|:----:|
| */api/tenant/layout-settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| */api/tenant/security-settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| */api/operator-permissions/* | ✅ | ✅ | ❌ | ❌ | ❌ |
| */api/tenant/email-templates/* | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/import/* | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/export/* | ✅ | ✅ | ✅ | ❌ | ❌ |
| */api/tenant/api-keys/* | ✅ | ✅ | ❌ | ❌ | ❌ |

> **범례**: ✅ 전체 접근 | 🔶 본인/담당만 | ❌ 접근 불가

---

## API 버전 관리

현재 버전: **v1** (기본, URL에 버전 미포함)

향후 Breaking Change 발생 시:
- `/api/v2/...` 형태로 새 버전 제공
- 기존 API는 6개월간 유지 후 Deprecation
