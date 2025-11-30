# Glossary - 용어 사전

> 프로젝트 내 사용하는 용어 정의
> **AI가 일관된 네이밍과 이해를 위해 참조**

---

## 도메인 용어

### 사용자 (User)

| 용어 | 정의 | 영문 | 코드 예시 |
|------|------|------|----------|
| 사용자 | 시스템 이용자 (수강생/강사/관리자) | User | `User`, `UserService` |
| 수강생 | 강의를 수강하는 사용자 | Student | `Role.STUDENT` |
| 강사 | 강의를 등록하는 사용자 | Instructor | `Role.INSTRUCTOR` |
| 관리자 | 시스템 관리 권한 보유자 | Admin | `Role.ADMIN` |

### 강의 (Course)

| 용어 | 정의 | 영문 | 코드 예시 |
|------|------|------|----------|
| 강의 | 교육 콘텐츠 단위 | Course | `Course`, `CourseService` |
| 강의 차수 | 강의의 특정 기수/회차 | Course Term | `CourseTerm` |
| 정원 | 수강 가능 최대 인원 | Capacity | `term.capacity` |
| 신청 기간 | 수강 신청 가능 기간 | Enrollment Period | `enrollmentStartDate`, `enrollmentEndDate` |

### 수강 신청 (Enrollment)

| 용어 | 정의 | 영문 | 코드 예시 |
|------|------|------|----------|
| 수강 신청 | 강의 차수에 등록 | Enrollment | `Enrollment`, `EnrollmentService` |
| 신청 상태 | 대기/승인/취소 | Enrollment Status | `EnrollmentStatus` |
| 수강 현황 | 신청자 수/정원 | Enrollment Stats | `currentCount`, `capacity` |

---

## 기술 용어

### Backend

| 용어 | 정의 | 사용 위치 |
|------|------|----------|
| Entity | DB 테이블과 매핑되는 도메인 객체 | `domain/*/entity/` |
| Repository | 데이터 접근 계층 (JPA) | `domain/*/repository/` |
| Service | 비즈니스 로직 계층 | `domain/*/service/` |
| Controller | HTTP 요청 처리 계층 | `domain/*/controller/` |
| DTO | 데이터 전송 객체 | `domain/*/dto/` |
| VO | 값 객체 (불변) | Entity 내부 |

### Frontend

| 용어 | 정의 | 사용 위치 |
|------|------|----------|
| Component | UI 재사용 단위 | `components/` |
| Page | 라우트에 매핑되는 화면 | `pages/` |
| Hook | 상태/로직 재사용 함수 | `hooks/` |
| Service | API 호출 함수 | `services/` |
| Store | 전역 상태 (React Query) | `hooks/queries/` |

### 인증/인가

| 용어 | 정의 | 코드 예시 |
|------|------|----------|
| Access Token | 단기 인증 토큰 (15분) | `accessToken` |
| Refresh Token | 장기 갱신 토큰 (7일) | `refreshToken` |
| Role | 사용자 권한 | `STUDENT`, `INSTRUCTOR`, `ADMIN` |

---

## 네이밍 규칙

### Entity/테이블명

| 한글 | 영문 (단수) | 테이블명 (복수) |
|------|------------|----------------|
| 사용자 | User | users |
| 강의 | Course | courses |
| 강의 차수 | CourseTerm | course_terms |
| 수강 신청 | Enrollment | enrollments |

### API Endpoint

| 리소스 | 목록 | 단건 | 생성 |
|--------|------|------|------|
| 사용자 | GET /users | GET /users/{id} | POST /users |
| 강의 | GET /courses | GET /courses/{id} | POST /courses |
| 수강 신청 | GET /enrollments | GET /enrollments/{id} | POST /enrollments |

### 변수명 (Java/TypeScript)

| 의미 | Java | TypeScript |
|------|------|------------|
| 강의 목록 | `List<Course> courses` | `courses: Course[]` |
| 사용자 ID | `Long userId` | `userId: number` |
| 신청 여부 | `boolean isEnrolled` | `isEnrolled: boolean` |
| 신청일 | `LocalDateTime enrolledAt` | `enrolledAt: string` |

---

## 상태값

### 수강 신청 상태 (EnrollmentStatus)

| 값 | 한글 | 설명 |
|----|------|------|
| `PENDING` | 대기 | 신청 후 승인 대기 |
| `APPROVED` | 승인 | 수강 승인됨 |
| `REJECTED` | 거절 | 수강 거절됨 |
| `CANCELLED` | 취소 | 사용자가 취소 |

### 강의 상태 (CourseStatus)

| 값 | 한글 | 설명 |
|----|------|------|
| `DRAFT` | 초안 | 작성 중 |
| `PUBLISHED` | 공개 | 수강 신청 가능 |
| `CLOSED` | 마감 | 신청 마감 |
| `ARCHIVED` | 보관 | 종료/비공개 |

---

## 약어

| 약어 | 전체 | 의미 |
|------|------|------|
| DTO | Data Transfer Object | 데이터 전송 객체 |
| VO | Value Object | 값 객체 |
| JPA | Java Persistence API | ORM 표준 |
| JWT | JSON Web Token | 인증 토큰 |
| CRUD | Create, Read, Update, Delete | 기본 작업 |
| API | Application Programming Interface | 인터페이스 |
| UI | User Interface | 사용자 화면 |
| UX | User Experience | 사용자 경험 |

---

## 용어 사용 예시

### 대화에서

```
❌ "수강 엔티티 만들어줘"
✅ "Enrollment Entity 만들어줘"

❌ "강의 리스트 API"
✅ "Course 목록 조회 API" 또는 "GET /courses"

❌ "유저 서비스 에러"
✅ "UserService에서 UserNotFoundException 발생"
```

### 코드에서

```java
// ✅ Good: 일관된 네이밍
public class EnrollmentService {
    public Enrollment createEnrollment(Long userId, Long courseTermId) { }
}

// ❌ Bad: 혼용
public class 수강Service {
    public Enrollment create수강(Long user_id, Long termId) { }
}
```

---

## 새 용어 추가 시

```markdown
| 용어 | 정의 | 영문 | 코드 예시 |
|------|------|------|----------|
| [한글] | [설명] | [English] | `CodeExample` |
```

---

> 도메인 관계 → [architecture.md](./architecture.md)
> DB 스키마 → [database.md](./database.md)
