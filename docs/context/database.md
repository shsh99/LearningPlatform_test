# Database Context

> AI가 DB 관련 작업 시 참조하는 상세 스키마 정보
> **Phase 1-3 전체 테이블 포함**

---

## ERD 개요

### 핵심 도메인 관계
```
┌─────────────────────────────────────────────────────────────────────┐
│                          TENANT LAYER                               │
│  Tenant (1) ─── (1) TenantBranding                                  │
│     │      └── (1) TenantSettings                                   │
│     │      └── (1) TenantLabels                                     │
│     │      └── (1) TenantLayoutSettings [Phase 3]                   │
│     │      └── (1) TenantSecuritySettings [Phase 3]                 │
│     │                                                               │
│     └──────────────────────────────────────────────────────────┐    │
│                                                                │    │
└────────────────────────────────────────────────────────────────│────┘
                                                                 │
┌────────────────────────────────────────────────────────────────│────┐
│                          USER LAYER                            │    │
│                                                                │    │
│  User (N) ←───────────────────────────────────────────────────┘    │
│    │                                                               │
│    ├── (1) RefreshToken                                            │
│    ├── (1) PasswordResetToken                                      │
│    └── (N) OperatorPermissions [Phase 3]                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    │
┌───────────────────│─────────────────────────────────────────────────┐
│                   │     COURSE LAYER                                │
│                   │                                                 │
│  Course (N) ←─────┘                                                 │
│    │                                                                │
│    └── (N) CourseTerm                                               │
│              │                                                      │
│              ├── (N) Enrollment ───→ (1) User                       │
│              │         └── (1) StudentInformationSystem             │
│              │                                                      │
│              └── (N) InstructorAssignment ───→ (1) User             │
│                        └── (1) InstructorInformationSystem          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                              │
│                                                                     │
│  CourseApplication (N) ───→ (1) User (신청자)                        │
│  TenantApplication (N) ───→ (1) User (신청자)                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      MONITORING LAYER [Phase 2-3]                   │
│                                                                     │
│  AuditLog (N) ───→ (1) Tenant, (1) User                             │
│  UsageStatistics (N) ───→ (1) Tenant                                │
│  Announcement (N) ───→ (1) Tenant (NULL = 글로벌)                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: 핵심 테이블 (현재 구현)

### tenants
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 테넌트 ID |
| code | VARCHAR(50) | UNIQUE, NOT NULL | 고유 코드 (URL용) |
| name | VARCHAR(100) | NOT NULL | 테넌트명 |
| domain | VARCHAR(255) | | 커스텀 도메인 |
| status | VARCHAR(20) | NOT NULL | ACTIVE/INACTIVE/SUSPENDED/DELETED |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### tenant_branding
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK, UNIQUE | 테넌트 ID |
| logo_url | VARCHAR(500) | | 로고 URL |
| favicon_url | VARCHAR(500) | | 파비콘 URL |
| primary_color | VARCHAR(7) | | 기본 색상 (#RRGGBB) |
| secondary_color | VARCHAR(7) | | 보조 색상 |
| accent_color | VARCHAR(7) | | 강조 색상 |
| header_bg_color | VARCHAR(7) | | 헤더 배경색 |
| header_text_color | VARCHAR(7) | | 헤더 텍스트색 |
| sidebar_bg_color | VARCHAR(7) | | 사이드바 배경색 |
| sidebar_text_color | VARCHAR(7) | | 사이드바 텍스트색 |
| sidebar_active_color | VARCHAR(7) | | 사이드바 활성 배경색 |
| sidebar_active_text_color | VARCHAR(7) | | 사이드바 활성 텍스트색 |
| button_primary_bg_color | VARCHAR(7) | | 기본 버튼 배경색 |
| button_primary_text_color | VARCHAR(7) | | 기본 버튼 텍스트색 |
| button_secondary_bg_color | VARCHAR(7) | | 보조 버튼 배경색 |
| button_secondary_text_color | VARCHAR(7) | | 보조 버튼 텍스트색 |
| background_color | VARCHAR(7) | | 페이지 배경색 |
| font_family | VARCHAR(100) | | 폰트 패밀리 |
| font_url | VARCHAR(500) | | 커스텀 폰트 URL |
| custom_css | TEXT | | 커스텀 CSS |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### tenant_settings
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK, UNIQUE | 테넌트 ID |
| course_enabled | BOOLEAN | DEFAULT TRUE | 강의 기능 활성화 |
| enrollment_enabled | BOOLEAN | DEFAULT TRUE | 수강신청 활성화 |
| application_enabled | BOOLEAN | DEFAULT TRUE | 강의개설신청 활성화 |
| dashboard_enabled | BOOLEAN | DEFAULT TRUE | 대시보드 활성화 |
| instructor_management_enabled | BOOLEAN | DEFAULT TRUE | 강사관리 활성화 |
| student_management_enabled | BOOLEAN | DEFAULT TRUE | 수강생관리 활성화 |
| report_enabled | BOOLEAN | DEFAULT TRUE | 리포트 활성화 |
| notification_enabled | BOOLEAN | DEFAULT TRUE | 알림 활성화 |
| menu_visibility | JSON | | 메뉴 표시 설정 |
| component_order | JSON | | 컴포넌트 순서 |
| max_users_limit | INT | DEFAULT 1000 | 최대 사용자 수 |
| max_courses_limit | INT | DEFAULT 100 | 최대 강의 수 |
| session_timeout_minutes | INT | DEFAULT 30 | 세션 타임아웃 |
| default_language | VARCHAR(10) | DEFAULT 'ko' | 기본 언어 |
| timezone | VARCHAR(50) | DEFAULT 'Asia/Seoul' | 타임존 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### tenant_labels
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK, UNIQUE | 테넌트 ID |
| course_label | VARCHAR(50) | DEFAULT '강의' | 강의 라벨 |
| term_label | VARCHAR(50) | DEFAULT '차수' | 차수 라벨 |
| student_label | VARCHAR(50) | DEFAULT '수강생' | 수강생 라벨 |
| instructor_label | VARCHAR(50) | DEFAULT '강사' | 강사 라벨 |
| enrollment_label | VARCHAR(50) | DEFAULT '수강신청' | 수강신청 라벨 |
| application_label | VARCHAR(50) | DEFAULT '신청' | 신청 라벨 |
| dashboard_label | VARCHAR(50) | DEFAULT '대시보드' | 대시보드 라벨 |
| platform_name | VARCHAR(100) | DEFAULT 'Learning Platform' | 플랫폼명 |
| custom_labels | JSON | | 추가 커스텀 라벨 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### users
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 사용자 ID |
| tenant_id | BIGINT | FK | 테넌트 ID (NULL = SUPER_ADMIN) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 (로그인 ID) |
| password | VARCHAR(255) | NOT NULL | BCrypt 암호화 |
| name | VARCHAR(100) | NOT NULL | 이름 |
| role | VARCHAR(20) | NOT NULL | 역할 (Enum) |
| status | VARCHAR(20) | NOT NULL | 상태 (Enum) |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### courses
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 강의 ID |
| tenant_id | BIGINT | FK, NOT NULL | 테넌트 ID |
| title | VARCHAR(255) | NOT NULL | 강의명 |
| description | TEXT | | 강의 설명 |
| max_students | INT | | 최대 수강 인원 |
| status | VARCHAR(20) | NOT NULL | 상태 (Enum) |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### course_terms
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 차수 ID |
| course_id | BIGINT | FK (courses) | 강의 ID |
| tenant_id | BIGINT | FK | 테넌트 ID |
| term_number | INT | NOT NULL | 차수 번호 |
| start_date | DATE | NOT NULL | 시작일 |
| end_date | DATE | NOT NULL | 종료일 |
| days_of_week | VARCHAR(100) | | 요일 (JSON) |
| start_time | TIME | | 시작 시간 |
| end_time | TIME | | 종료 시간 |
| capacity | INT | NOT NULL | 정원 |
| current_students | INT | DEFAULT 0 | 현재 인원 |
| status | VARCHAR(20) | NOT NULL | 상태 (Enum) |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### enrollments
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 수강 ID |
| course_term_id | BIGINT | FK | 차수 ID |
| user_id | BIGINT | FK | 사용자 ID |
| tenant_id | BIGINT | FK | 테넌트 ID |
| status | VARCHAR(20) | NOT NULL | 상태 (Enum) |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### instructor_assignments
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 배정 ID |
| course_term_id | BIGINT | FK | 차수 ID |
| instructor_id | BIGINT | FK | 강사 ID (User) |
| assigned_by | BIGINT | FK | 배정자 ID |
| tenant_id | BIGINT | FK | 테넌트 ID |
| status | VARCHAR(20) | NOT NULL | 상태 (Enum) |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### student_information_system (SIS)
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| user_id | BIGINT | FK | 수강생 ID |
| course_term_id | BIGINT | FK | 차수 ID |
| enrollment_id | BIGINT | FK | 수강 ID |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |

### instructor_information_system (IIS)
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| user_id | BIGINT | FK | 강사 ID |
| course_term_id | BIGINT | FK | 차수 ID |
| assignment_id | BIGINT | FK | 배정 ID |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |

### course_applications
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 신청 ID |
| tenant_id | BIGINT | FK | 테넌트 ID |
| applicant_id | BIGINT | FK | 신청자 ID |
| course_title | VARCHAR(255) | NOT NULL | 강의명 |
| description | TEXT | | 강의 설명 |
| reason | TEXT | | 신청 사유 |
| status | VARCHAR(20) | NOT NULL | 상태 (Enum) |
| reviewed_by | BIGINT | FK | 검토자 ID |
| reviewed_at | TIMESTAMP | | 검토일시 |
| reject_reason | TEXT | | 거절 사유 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### tenant_applications
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 신청 ID |
| company_name | VARCHAR(100) | NOT NULL | 회사명 |
| company_code | VARCHAR(50) | NOT NULL | 회사 코드 |
| contact_name | VARCHAR(100) | NOT NULL | 담당자명 |
| contact_email | VARCHAR(255) | NOT NULL | 담당자 이메일 |
| contact_phone | VARCHAR(20) | | 담당자 연락처 |
| expected_users | INT | | 예상 사용자 수 |
| description | TEXT | | 신청 내용 |
| status | VARCHAR(20) | NOT NULL | 상태 (Enum) |
| reviewed_by | BIGINT | FK | 검토자 ID |
| reviewed_at | TIMESTAMP | | 검토일시 |
| reject_reason | TEXT | | 거절 사유 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### refresh_tokens
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| user_id | BIGINT | FK | 사용자 ID |
| tenant_id | BIGINT | FK | 테넌트 ID |
| token | VARCHAR(500) | UNIQUE | 토큰 값 |
| expires_at | TIMESTAMP | NOT NULL | 만료일시 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |

### password_reset_tokens
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| user_id | BIGINT | FK | 사용자 ID |
| tenant_id | BIGINT | FK | 테넌트 ID |
| token | VARCHAR(500) | UNIQUE | 토큰 값 |
| expires_at | TIMESTAMP | NOT NULL | 만료일시 |
| used | BOOLEAN | DEFAULT FALSE | 사용 여부 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |

---

## Enum 값 정의 (실제 코드 기준)

### UserRole
```java
USER           // 일반 사용자 (수강생)
INSTRUCTOR     // 강사
OPERATOR       // 운영자
ADMIN          // 관리자 (기존 호환성)
TENANT_ADMIN   // 테넌트 관리자
SUPER_ADMIN    // 슈퍼 관리자 (전체 시스템)
```

### UserStatus
```java
ACTIVE         // 활성
INACTIVE       // 비활성
SUSPENDED      // 정지
```

### TenantStatus
```java
ACTIVE         // 활성
INACTIVE       // 비활성
SUSPENDED      // 정지
DELETED        // 삭제됨
```

### CourseStatus
```java
DRAFT          // 초안
PENDING        // 승인 대기
APPROVED       // 승인됨
REJECTED       // 거부됨
```

### TermStatus
```java
SCHEDULED      // 예정됨
ONGOING        // 진행 중
COMPLETED      // 완료됨
CANCELLED      // 취소됨
```

### EnrollmentStatus
```java
ENROLLED       // 수강중
CANCELLED      // 취소됨
COMPLETED      // 수강완료
```

### AssignmentStatus
```java
ASSIGNED       // 배정됨
CANCELLED      // 취소됨
```

### ApplicationStatus (Course/Tenant)
```java
PENDING        // 대기중
APPROVED       // 승인됨
REJECTED       // 거절됨
```

---

## Phase 2: 모니터링 테이블 (신규)

### audit_logs
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK | 테넌트 ID (NULL = 시스템) |
| user_id | BIGINT | NOT NULL | 수행한 사용자 ID |
| action | VARCHAR(50) | NOT NULL | CREATE/UPDATE/DELETE/LOGIN |
| entity_type | VARCHAR(100) | NOT NULL | User, Course, Tenant 등 |
| entity_id | BIGINT | | 대상 엔티티 ID |
| old_value | JSON | | 변경 전 값 |
| new_value | JSON | | 변경 후 값 |
| ip_address | VARCHAR(50) | | IP 주소 |
| user_agent | VARCHAR(500) | | User-Agent |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |

### usage_statistics
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK, NOT NULL | 테넌트 ID |
| stat_date | DATE | NOT NULL | 집계 날짜 |
| active_users | INT | DEFAULT 0 | 활성 사용자 수 |
| login_count | INT | DEFAULT 0 | 로그인 횟수 |
| api_calls | INT | DEFAULT 0 | API 호출 수 |
| storage_used_mb | DECIMAL(10,2) | | 스토리지 사용량 (MB) |
| course_views | INT | DEFAULT 0 | 강의 조회 수 |
| enrollments | INT | DEFAULT 0 | 수강 신청 수 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |

**인덱스:**
```sql
UNIQUE KEY uk_tenant_date (tenant_id, stat_date)
```

### announcements
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK | 테넌트 ID (NULL = 글로벌) |
| title | VARCHAR(200) | NOT NULL | 제목 |
| content | TEXT | NOT NULL | 내용 |
| type | VARCHAR(20) | NOT NULL | INFO/WARNING/URGENT |
| is_popup | BOOLEAN | DEFAULT FALSE | 팝업 표시 여부 |
| start_date | TIMESTAMP | | 표시 시작일 |
| end_date | TIMESTAMP | | 표시 종료일 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성화 여부 |
| created_by | BIGINT | FK | 작성자 ID |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

---

## Phase 3: 커스터마이징 테이블 (신규)

### tenant_layout_settings
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK, UNIQUE | 테넌트 ID |
| header_search_enabled | BOOLEAN | DEFAULT TRUE | 헤더 검색바 |
| sidebar_enabled | BOOLEAN | DEFAULT TRUE | 사이드바 |
| footer_enabled | BOOLEAN | DEFAULT TRUE | 푸터 |
| banner_enabled | BOOLEAN | DEFAULT TRUE | 배너 섹션 |
| announcement_popup_enabled | BOOLEAN | DEFAULT FALSE | 공지 팝업 |
| ad_section_enabled | BOOLEAN | DEFAULT FALSE | 광고 영역 |
| menu_config | JSON | | 메뉴 구성 (순서, 표시) |
| theme_template | VARCHAR(50) | DEFAULT 'light' | 테마 템플릿 |
| saved_themes | JSON | | 저장된 커스텀 테마 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### tenant_security_settings
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK, UNIQUE | 테넌트 ID |
| password_min_length | INT | DEFAULT 8 | 비밀번호 최소 길이 |
| password_require_uppercase | BOOLEAN | DEFAULT TRUE | 대문자 필수 |
| password_require_lowercase | BOOLEAN | DEFAULT TRUE | 소문자 필수 |
| password_require_number | BOOLEAN | DEFAULT TRUE | 숫자 필수 |
| password_require_special | BOOLEAN | DEFAULT FALSE | 특수문자 필수 |
| password_expiry_days | INT | DEFAULT 0 | 비밀번호 만료일 (0=없음) |
| session_timeout_minutes | INT | DEFAULT 30 | 세션 타임아웃 |
| max_concurrent_sessions | INT | DEFAULT 3 | 동시 세션 수 |
| max_login_attempts | INT | DEFAULT 5 | 로그인 시도 제한 |
| lockout_duration_minutes | INT | DEFAULT 30 | 잠금 시간 |
| two_factor_enabled | BOOLEAN | DEFAULT FALSE | 2FA 활성화 |
| ip_whitelist_enabled | BOOLEAN | DEFAULT FALSE | IP 화이트리스트 |
| ip_whitelist | JSON | | 허용 IP 목록 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### operator_permissions
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| user_id | BIGINT | FK, NOT NULL | OPERATOR 사용자 ID |
| tenant_id | BIGINT | FK, NOT NULL | 테넌트 ID |
| permission | VARCHAR(50) | NOT NULL | 권한 코드 |
| granted | BOOLEAN | DEFAULT TRUE | 권한 부여 여부 |
| granted_by | BIGINT | FK | 권한 부여자 ID |
| granted_at | TIMESTAMP | | 부여일시 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

**인덱스:**
```sql
UNIQUE KEY uk_user_permission (user_id, permission)
```

**권한 코드:**
```
COURSE_READ, COURSE_WRITE, COURSE_DELETE, COURSE_APPROVE
USER_READ, USER_WRITE
ENROLLMENT_MANAGE, TERM_MANAGE, INSTRUCTOR_ASSIGN
REPORT_VIEW
```

### tenant_email_templates
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | ID |
| tenant_id | BIGINT | FK, NOT NULL | 테넌트 ID |
| template_type | VARCHAR(50) | NOT NULL | 템플릿 유형 |
| subject | VARCHAR(200) | NOT NULL | 이메일 제목 |
| body | TEXT | NOT NULL | 이메일 본문 (HTML) |
| variables | JSON | | 사용 가능한 변수 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성화 여부 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

**인덱스:**
```sql
UNIQUE KEY uk_tenant_template (tenant_id, template_type)
```

**템플릿 유형:**
```
welcome, password_reset, enrollment_approved, enrollment_rejected, course_reminder
```

---

## 인덱스 권장사항

### Phase 1 인덱스
```sql
-- 테넌트 기반 조회 (모든 테이블)
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_courses_tenant_id ON courses(tenant_id);
CREATE INDEX idx_course_terms_tenant_id ON course_terms(tenant_id);
CREATE INDEX idx_enrollments_tenant_id ON enrollments(tenant_id);

-- 자주 조회되는 컬럼
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_tenant_role ON users(tenant_id, role);
CREATE INDEX idx_tenants_code ON tenants(code);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_course_terms_course_id ON course_terms(course_id);
CREATE INDEX idx_course_terms_status ON course_terms(status);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_term_id ON enrollments(course_term_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

### Phase 2 인덱스
```sql
-- 감사 로그
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- 사용량 통계
CREATE INDEX idx_usage_stats_tenant_date ON usage_statistics(tenant_id, stat_date);
```

---

## N+1 쿼리 주의사항

### 문제 발생 케이스
```java
// ❌ N+1 발생
List<CourseTerm> terms = courseTermRepository.findAll();
for (CourseTerm term : terms) {
    term.getCourse().getTitle(); // 매번 쿼리 발생
}
```

### 해결 방법
```java
// ✅ Fetch Join 사용
@Query("SELECT ct FROM CourseTerm ct JOIN FETCH ct.course")
List<CourseTerm> findAllWithCourse();

// ✅ EntityGraph 사용
@EntityGraph(attributePaths = {"course"})
List<CourseTerm> findByStatus(TermStatus status);

// ✅ 테넌트 조회 시 브랜딩 함께 로드
@EntityGraph(attributePaths = {"branding", "settings", "labels"})
Optional<Tenant> findByCode(String code);
```

### 테넌트 필터 주의
```java
// ❌ findById()는 @Filter 미적용 - 크로스테넌트 접근 가능
Course course = courseRepository.findById(id);

// ✅ 테넌트 검증 포함 조회
Course course = courseRepository.findByIdAndTenantId(id, tenantId);
```

---

## 관련 문서

- [feature-roadmap.md](./feature-roadmap.md) - 기능 로드맵
- [architecture.md](./architecture.md) - 시스템 아키텍처
- [multi-tenancy.md](./multi-tenancy.md) - 멀티테넌시 구현
