# API Context

> AI가 API 관련 작업 시 참조하는 상세 명세

---

## 인증 API

### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123!"
}
```
**Response (200):**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "role": "STUDENT"
  }
}
```

### POST /api/auth/register
**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123!",
  "name": "김철수"
}
```
**Response (201):**
```json
{
  "id": 2,
  "email": "newuser@example.com",
  "name": "김철수",
  "role": "USER"
}
```

### POST /api/auth/refresh
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

---

## 사용자 API

### GET /api/users
**Query Parameters:**
- `page` (default: 0)
- `size` (default: 20)
- `role` (optional): ADMIN/OPERATOR/INSTRUCTOR/STUDENT/USER
- `status` (optional): ACTIVE/INACTIVE/SUSPENDED

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "email": "admin@example.com",
      "name": "관리자",
      "role": "ADMIN",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20
}
```

### GET /api/users/{id}
**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "role": "STUDENT",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T00:00:00"
}
```

### PUT /api/users/{id}
**Request:**
```json
{
  "name": "김영희",
  "role": "INSTRUCTOR"
}
```

### DELETE /api/users/{id}
**Response (204):** No Content

---

## 강의 API

### GET /api/courses
**Query Parameters:**
- `page`, `size`
- `status`: DRAFT/PUBLISHED/CLOSED/ARCHIVED
- `category`: 카테고리 필터

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Spring Boot 기초",
      "description": "Spring Boot 입문 강의",
      "category": "백엔드",
      "instructorName": "김강사",
      "status": "PUBLISHED",
      "termCount": 3
    }
  ],
  "totalElements": 50,
  "totalPages": 3
}
```

### POST /api/courses
**Request:**
```json
{
  "title": "React 실전",
  "description": "React를 활용한 실전 프로젝트",
  "category": "프론트엔드",
  "instructorId": 5
}
```

### GET /api/courses/{id}/terms
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

---

## 수강신청 API

### GET /api/enrollments
**Query Parameters:**
- `page`, `size`
- `status`: PENDING/APPROVED/REJECTED/CANCELLED
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
      "status": "PENDING",
      "appliedAt": "2024-03-15T10:30:00"
    }
  ]
}
```

### POST /api/enrollments
**Request:**
```json
{
  "userId": 10,
  "courseTermId": 5
}
```
**Response (201):**
```json
{
  "id": 1,
  "status": "PENDING",
  "appliedAt": "2024-03-15T10:30:00"
}
```

### PUT /api/enrollments/{id}/approve
**Response (200):**
```json
{
  "id": 1,
  "status": "APPROVED",
  "processedAt": "2024-03-15T14:00:00"
}
```

### PUT /api/enrollments/{id}/reject
**Response (200):**
```json
{
  "id": 1,
  "status": "REJECTED",
  "processedAt": "2024-03-15T14:00:00"
}
```

---

## 대시보드 API

### GET /api/dashboard/stats
**Response (200):**
```json
{
  "totalUsers": 500,
  "totalCourses": 25,
  "totalTerms": 75,
  "pendingApplications": 15,
  "approvedApplications": 120,
  "rejectedApplications": 8,
  "scheduledTerms": 10,
  "inProgressTerms": 20,
  "completedTerms": 40,
  "cancelledTerms": 5,
  "usersByRole": {
    "ADMIN": 2,
    "OPERATOR": 5,
    "INSTRUCTOR": 10,
    "STUDENT": 400,
    "USER": 83
  }
}
```

---

## 에러 응답 형식

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
| USER_NOT_FOUND | 404 | 사용자 없음 |
| COURSE_NOT_FOUND | 404 | 강의 없음 |
| TERM_NOT_FOUND | 404 | 차수 없음 |
| DUPLICATE_EMAIL | 409 | 이메일 중복 |
| INVALID_PASSWORD | 400 | 비밀번호 형식 오류 |
| TERM_FULL | 400 | 정원 초과 |
| ALREADY_ENROLLED | 409 | 이미 신청됨 |
| UNAUTHORIZED | 401 | 인증 필요 |
| FORBIDDEN | 403 | 권한 없음 |

---

## 인증 헤더

```
Authorization: Bearer {accessToken}
```

### 권한별 접근 가능 API
| API | ADMIN | OPERATOR | INSTRUCTOR | STUDENT | USER |
|-----|-------|----------|------------|---------|------|
| GET /api/users | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/courses | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/enrollments | ✅ | ✅ | ✅ (본인) | ✅ (본인) | ✅ (본인) |
| PUT /api/enrollments/{id}/approve | ✅ | ✅ | ❌ | ❌ | ❌ |
