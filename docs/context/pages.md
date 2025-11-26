# Pages Context

> AI가 프론트엔드 페이지 작업 시 참조하는 상세 명세

---

## 페이지 구조

```
/                       → 홈 (로그인 리다이렉트)
/login                  → 로그인
/register               → 회원가입
/dashboard              → 대시보드 (역할별)
/users                  → 사용자 관리 (ADMIN/OPERATOR)
/courses                → 강의 목록
/courses/:id            → 강의 상세
/courses/:id/terms      → 차수 관리
/enrollments            → 수강신청 관리
/my-enrollments         → 내 수강신청 (STUDENT)
/profile                → 프로필
```

---

## 페이지별 상세

### 로그인 (/login)
**컴포넌트:** `LoginPage.tsx`

**기능:**
- 이메일/비밀번호 입력
- 로그인 버튼
- 회원가입 링크
- 에러 메시지 표시

**상태:**
```typescript
interface LoginForm {
  email: string;
  password: string;
}
```

**API 호출:**
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
| ADMIN/OPERATOR | 전체 통계, 차트, 최근 신청 목록 |
| INSTRUCTOR | 담당 강의 통계, 수강생 현황 |
| STUDENT | 내 수강 현황, 진행중 강의 |

**차트 컴포넌트:**
- `UserRoleChart` - 사용자 역할 분포 (파이 차트)
- `TermStatusChart` - 차수 상태 현황 (도넛 차트)
- `ApplicationStatusChart` - 신청 현황 (가로 막대 차트)

**API 호출:**
- `GET /api/dashboard/stats`

---

### 사용자 관리 (/users)
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
| 액션 | ❌ | ❌ |

**API 호출:**
- `GET /api/users` (목록)
- `POST /api/users` (생성)
- `PUT /api/users/{id}` (수정)
- `DELETE /api/users/{id}` (삭제)

---

### 강의 목록 (/courses)
**컴포넌트:** `CourseListPage.tsx`

**기능:**
- 강의 카드 그리드
- 카테고리 필터
- 상태 필터
- 검색
- 강의 추가 버튼 (ADMIN/OPERATOR)

**카드 내용:**
- 강의명
- 카테고리 배지
- 강사명
- 차수 수
- 상태 배지

---

### 강의 상세 (/courses/:id)
**컴포넌트:** `CourseDetailPage.tsx`

**기능:**
- 강의 정보 표시
- 차수 목록 테이블
- 차수 추가 (ADMIN/OPERATOR)
- 수강신청 버튼 (STUDENT - 열린 차수)

**차수 테이블:**
| 컬럼 | 설명 |
|------|------|
| 차수 | n차 |
| 기간 | 시작일 ~ 종료일 |
| 정원 | 등록/전체 |
| 상태 | 배지 |
| 액션 | 신청/상세 |

---

### 수강신청 관리 (/enrollments)
**컴포넌트:** `EnrollmentManagementPage.tsx`

**기능:**
- 신청 목록 테이블
- 상태별 필터 (대기/승인/거절)
- 일괄 승인/거절
- 개별 승인/거절

**테이블 컬럼:**
| 컬럼 | 설명 |
|------|------|
| 체크박스 | 일괄 선택 |
| 신청자 | 이름 (이메일) |
| 강의 | 강의명 - n차 |
| 신청일 | 날짜/시간 |
| 상태 | 배지 |
| 액션 | 승인/거절 버튼 |

**API 호출:**
- `GET /api/enrollments`
- `PUT /api/enrollments/{id}/approve`
- `PUT /api/enrollments/{id}/reject`

---

## 공통 컴포넌트

### Layout
```
Header
├── Logo
├── Navigation (역할별)
└── UserMenu (프로필, 로그아웃)

Sidebar (접기 가능)
├── 메뉴 항목 (역할별)
└── 현재 위치 표시

Main Content
└── Page Component
```

### 공통 UI 컴포넌트
| 컴포넌트 | 위치 | 용도 |
|----------|------|------|
| `Button` | components/common | 버튼 |
| `Input` | components/common | 입력 필드 |
| `Select` | components/common | 드롭다운 |
| `Modal` | components/common | 모달 |
| `Table` | components/common | 테이블 |
| `Pagination` | components/common | 페이지네이션 |
| `Badge` | components/common | 상태 배지 |
| `Card` | components/common | 카드 |
| `Toast` | components/common | 알림 |

---

## 상태 배지 색상

### 사용자 상태
| 상태 | 색상 | TailwindCSS |
|------|------|-------------|
| ACTIVE | 초록 | `bg-green-100 text-green-800` |
| INACTIVE | 회색 | `bg-gray-100 text-gray-800` |
| SUSPENDED | 빨강 | `bg-red-100 text-red-800` |

### 차수 상태
| 상태 | 색상 | TailwindCSS |
|------|------|-------------|
| SCHEDULED | 파랑 | `bg-blue-100 text-blue-800` |
| ONGOING | 초록 | `bg-green-100 text-green-800` |
| COMPLETED | 회색 | `bg-gray-100 text-gray-800` |
| CANCELLED | 빨강 | `bg-red-100 text-red-800` |

### 신청 상태
| 상태 | 색상 | TailwindCSS |
|------|------|-------------|
| PENDING | 노랑 | `bg-yellow-100 text-yellow-800` |
| APPROVED | 초록 | `bg-green-100 text-green-800` |
| REJECTED | 빨강 | `bg-red-100 text-red-800` |

---

## 권한별 메뉴

### ADMIN / OPERATOR
- 대시보드
- 사용자 관리
- 강의 관리
- 차수 관리
- 수강신청 관리

### INSTRUCTOR
- 대시보드
- 담당 강의
- 수강생 관리

### STUDENT
- 대시보드
- 강의 목록
- 내 수강신청

### USER
- 대시보드
- 강의 목록
- 프로필

---

## 라우트 가드

```typescript
// ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

// 사용 예시
<ProtectedRoute allowedRoles={['ADMIN', 'OPERATOR']}>
  <UserManagementPage />
</ProtectedRoute>
```

### 인증 체크 순서
1. accessToken 존재 확인
2. 토큰 만료 확인
3. 만료 시 refreshToken으로 갱신
4. 갱신 실패 시 로그인 페이지로 리다이렉트
5. 역할 확인 (allowedRoles)
6. 권한 없으면 403 페이지
